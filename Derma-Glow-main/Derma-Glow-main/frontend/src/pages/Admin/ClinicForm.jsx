import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createClinic, getClinic, updateClinic } from "../../utils/api";
import { ArrowLeft } from "lucide-react";

const defaultHours = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => ({ day, open24h: true, opensAt: "", closesAt: "" }));

const normalizePhone = (val) => val.replace(/[^0-9+]/g, "");
// Basic Pakistan validation: allows +92XXXXXXXXXX or 03XXXXXXXXX or 0XXXXXXXXXX (landline)
const isValidPakistanPhone = (val) => {
  const digits = val.replace(/\D/g, "");
  // +92 format
  if (/^\+?92\d{10}$/.test(val.replace(/\D/g, "").replace(/^92/, "+92"))) return true;
  // Mobile 03XXXXXXXXX (11 digits)
  if (/^03\d{9}$/.test(digits)) return true;
  // Landline: 0 + 2-3 digit area + 7-8 digits
  if (/^0\d{10,11}$/.test(digits)) return true;
  return false;
};

const ClinicForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    rating: 0,
    address: "",
    coordinates: { lat: 0, lng: 0 },
    phone: "",
    hours: defaultHours,
    doctors: [],
  });
  const [doctor, setDoctor] = useState({ name: "", specialty: "", phone: "" });

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      const data = await getClinic(id);
      // Parse stored hours (day + label) into UI format
      const uiHours = (data.hours || []).map(h => {
        const label = h.label || "";
        if (/open 24 hours/i.test(label)) {
          return { day: h.day, open24h: true, opensAt: "", closesAt: "" };
        }
        const parts = label.split(/\s*[–-]\s*/);
        return { day: h.day, open24h: false, opensAt: parts[0] || "", closesAt: parts[1] || "" };
      });
      setForm({
        name: data.name || "",
        rating: data.rating || 0,
        address: data.address || "",
        coordinates: {
          lat: data.coordinates?.lat !== undefined ? String(data.coordinates.lat) : "",
          lng: data.coordinates?.lng !== undefined ? String(data.coordinates.lng) : "",
        },
        phone: data.phone || "",
        hours: uiHours.length ? uiHours : defaultHours,
        doctors: data.doctors || [],
      });
    };
    load();
  }, [id, isEdit]);

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const [errors, setErrors] = useState({});

  const submit = async (e) => {
    e.preventDefault();
    const phoneOk = isValidPakistanPhone(form.phone || "");
    if (!phoneOk) {
      setErrors(prev => ({ ...prev, phone: "Enter a valid Pakistani phone number (mobile or landline)." }));
      return;
    }

    // Map UI hours to stored label form
    const mappedHours = (form.hours || []).map(h => ({
      day: h.day,
      label: h.open24h ? "Open 24 hours" : `${h.opensAt || ""} – ${h.closesAt || ""}`.trim(),
    }));

    const latNum = parseFloat(form.coordinates.lat);
    const lngNum = parseFloat(form.coordinates.lng);
    const payload = {
      ...form,
      coordinates: { lat: isNaN(latNum) ? 0 : latNum, lng: isNaN(lngNum) ? 0 : lngNum },
      hours: mappedHours,
    };
    if (isEdit) await updateClinic(id, payload); else await createClinic(payload);
    navigate("/admin/clinics");
  };

  const addDoctor = () => {
    if (!doctor.name) return;
    setForm(prev => ({ ...prev, doctors: [ ...prev.doctors, doctor ] }));
    setDoctor({ name: "", specialty: "", phone: "" });
  };

  const removeDoctor = (idx) => {
    setForm(prev => ({ ...prev, doctors: prev.doctors.filter((_, i) => i !== idx) }));
  };

  const toggleOpen24 = (idx) => {
    const newHours = [ ...form.hours ];
    newHours[idx].open24h = !newHours[idx].open24h;
    setField("hours", newHours);
  };

  const setHour = (idx, key, value) => {
    const newHours = [ ...form.hours ];
    newHours[idx][key] = value;
    setField("hours", newHours);
  };

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/clinics")}
        className="flex items-center gap-2 text-[#5C6748] hover:text-[#A2AA7B] transition-colors mb-4"
      >
        <ArrowLeft size={20} />
        <span>Back to Clinics</span>
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#5C6748] mb-2">
          {isEdit ? "Edit Clinic" : "Add New Clinic"}
        </h1>
        <p className="text-[#8C9669]">
          {isEdit ? "Update clinic information and details" : "Fill in the details to add a new clinic"}
        </p>
      </div>

      <form onSubmit={submit} className="bg-white rounded-xl shadow-sm border border-[#E7EAE5] p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-[#5C6748] mb-2">Clinic Name *</label>
          <input
            value={form.name}
            onChange={e => setField("name", e.target.value)}
            className="w-full px-4 py-3 border border-[#A2AA7B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2AA7B] focus:border-[#A2AA7B] transition-colors"
            placeholder="Enter clinic name"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#5C6748] mb-2">Rating (0-5)</label>
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={form.rating}
              onChange={e => {
                const value = e.target.value;
                // Allow empty string temporarily for better UX
                if (value === '') {
                  setField("rating", '');
                  return;
                }
                const numValue = parseFloat(value);
                // Only update if value is valid number and within range
                if (!isNaN(numValue)) {
                  if (numValue < 0) {
                    setField("rating", 0);
                  } else if (numValue > 5) {
                    setField("rating", 5);
                  } else {
                    setField("rating", numValue);
                  }
                }
              }}
              onBlur={e => {
                // Ensure value is set to 0 if empty on blur
                if (e.target.value === '' || isNaN(parseFloat(e.target.value))) {
                  setField("rating", 0);
                }
              }}
              onKeyDown={e => {
                // Allow: backspace, delete, tab, escape, enter, decimal point, minus (but we'll handle it)
                if ([8, 9, 27, 13, 46, 110, 190].indexOf(e.keyCode) !== -1 ||
                    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                    (e.keyCode === 65 && e.ctrlKey === true) ||
                    (e.keyCode === 67 && e.ctrlKey === true) ||
                    (e.keyCode === 86 && e.ctrlKey === true) ||
                    (e.keyCode === 88 && e.ctrlKey === true) ||
                    // Allow: home, end, left, right, down, up
                    (e.keyCode >= 35 && e.keyCode <= 40)) {
                  return;
                }
                // Prevent minus sign
                if (e.keyCode === 189 || e.keyCode === 109) {
                  e.preventDefault();
                  return;
                }
                // Prevent numbers that would make value > 5
                const currentValue = parseFloat(e.target.value) || 0;
                const key = e.key;
                if (!isNaN(parseInt(key))) {
                  const testValue = parseFloat(currentValue.toString() + key);
                  if (testValue > 5) {
                    e.preventDefault();
                    return;
                  }
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                  e.preventDefault();
                }
              }}
              onWheel={e => {
                // Prevent mouse wheel from changing the value
                e.target.blur();
              }}
              onInput={e => {
                // Additional check on input event
                const value = parseFloat(e.target.value);
                if (!isNaN(value)) {
                  if (value < 0) {
                    e.target.value = 0;
                    setField("rating", 0);
                  } else if (value > 5) {
                    e.target.value = 5;
                    setField("rating", 5);
                  }
                }
              }}
              className="w-full px-4 py-3 border border-[#A2AA7B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2AA7B] focus:border-[#A2AA7B] transition-colors"
              placeholder="0.0"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#5C6748] mb-2">Phone (Pakistan) *</label>
            <input
              value={form.phone}
              onChange={e => { setField("phone", normalizePhone(e.target.value)); setErrors(prev => ({ ...prev, phone: "" })); }}
              className="w-full px-4 py-3 border border-[#A2AA7B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2AA7B] focus:border-[#A2AA7B] transition-colors"
              placeholder="e.g. 03XXXXXXXXX or +92XXXXXXXXXX"
            />
            {errors.phone && <div className="text-red-600 text-xs mt-2">{errors.phone}</div>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#5C6748] mb-2">Address</label>
          <input
            value={form.address}
            onChange={e => setField("address", e.target.value)}
            className="w-full px-4 py-3 border border-[#A2AA7B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2AA7B] focus:border-[#A2AA7B] transition-colors"
            placeholder="Enter clinic address"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#5C6748] mb-2">Latitude</label>
            <input
              inputMode="decimal"
              type="text"
              value={String(form.coordinates.lat ?? "")}
              onChange={e => setField("coordinates", { ...form.coordinates, lat: e.target.value })}
              className="w-full px-4 py-3 border border-[#A2AA7B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2AA7B] focus:border-[#A2AA7B] transition-colors"
              placeholder="e.g. 24.8607"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#5C6748] mb-2">Longitude</label>
            <input
              inputMode="decimal"
              type="text"
              value={String(form.coordinates.lng ?? "")}
              onChange={e => setField("coordinates", { ...form.coordinates, lng: e.target.value })}
              className="w-full px-4 py-3 border border-[#A2AA7B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2AA7B] focus:border-[#A2AA7B] transition-colors"
              placeholder="e.g. 67.0011"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#5C6748] mb-3">Operating Hours</label>
          <div className="space-y-3 bg-[#F5F7F0] p-4 rounded-lg">
            {form.hours.map((h, idx) => (
              <div key={h.day} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center bg-white p-3 rounded-lg">
                <div className="font-semibold text-[#5C6748]">{h.day}</div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={h.open24h}
                    onChange={() => toggleOpen24(idx)}
                    className="w-4 h-4 text-[#A2AA7B] border-[#A2AA7B] rounded focus:ring-[#A2AA7B]"
                  />
                  <span className="text-sm text-[#5C6748]">Open 24 hours</span>
                </label>
                {!h.open24h && (
                  <>
                    <input
                      type="time"
                      value={h.opensAt || ""}
                      onChange={e => setHour(idx, "opensAt", e.target.value)}
                      className="px-3 py-2 border border-[#A2AA7B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2AA7B] focus:border-[#A2AA7B] transition-colors"
                    />
                    <input
                      type="time"
                      value={h.closesAt || ""}
                      onChange={e => setHour(idx, "closesAt", e.target.value)}
                      className="px-3 py-2 border border-[#A2AA7B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2AA7B] focus:border-[#A2AA7B] transition-colors"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#5C6748] mb-3">Doctors</label>
          <div className="bg-[#F5F7F0] p-4 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                placeholder="Doctor Name"
                value={doctor.name}
                onChange={e => setDoctor({ ...doctor, name: e.target.value })}
                className="px-4 py-2 border border-[#A2AA7B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2AA7B] focus:border-[#A2AA7B] transition-colors bg-white"
              />
              <input
                placeholder="Specialty"
                value={doctor.specialty}
                onChange={e => setDoctor({ ...doctor, specialty: e.target.value })}
                className="px-4 py-2 border border-[#A2AA7B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2AA7B] focus:border-[#A2AA7B] transition-colors bg-white"
              />
              <input
                placeholder="Phone"
                value={doctor.phone}
                onChange={e => setDoctor({ ...doctor, phone: e.target.value })}
                className="px-4 py-2 border border-[#A2AA7B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A2AA7B] focus:border-[#A2AA7B] transition-colors bg-white"
              />
              <button
                type="button"
                onClick={addDoctor}
                className="px-4 py-2 bg-[#A2AA7B] text-white rounded-lg hover:bg-[#8B936A] transition-colors font-medium"
              >
                Add Doctor
              </button>
            </div>
            {form.doctors.length > 0 && (
              <div className="space-y-2">
                {form.doctors.map((d, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-white p-3 rounded-lg border border-[#E7EAE5]"
                  >
                    <div>
                      <div className="font-semibold text-[#5C6748]">{d.name}</div>
                      <div className="text-sm text-[#8C9669]">
                        {d.specialty} {d.phone ? `• ${d.phone}` : ''}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDoctor(idx)}
                      className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-[#E7EAE5]">
          <button
            type="submit"
            className="px-6 py-3 bg-[#A2AA7B] text-white rounded-lg hover:bg-[#8B936A] transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
          >
            {isEdit ? "Save Changes" : "Create Clinic"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-[#A2AA7B] text-[#5C6748] rounded-lg hover:bg-[#F5F7F0] transition-colors font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClinicForm;


