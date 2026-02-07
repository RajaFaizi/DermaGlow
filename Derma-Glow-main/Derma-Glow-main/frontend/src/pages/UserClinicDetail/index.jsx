import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClinic } from "../../utils/api";
import { MapPin, Phone, Star, Clock, ArrowLeft, User } from "lucide-react";

const UserClinicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getClinic(id);
        setClinic(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="h-full flex items-center justify-center text-[#5C6748]">Loading...</div>;
  if (!clinic) return <div className="h-full flex items-center justify-center text-[#5C6748]">Clinic not found</div>;

  const { name, rating, address, phone, hours, coordinates, doctors } = clinic;
  const lat = Number(coordinates?.lat || 0);
  const lng = Number(coordinates?.lng || 0);
  const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-white to-[#F5F7F0]">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/explore-clinics")}
          className="flex items-center gap-2 text-[#5C6748] hover:text-[#A2AA7B] transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Clinics</span>
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-xl font-bold text-[#5C6748]">{name}</h1>
            {rating > 0 && (
              <div className="flex items-center gap-1 bg-[#A2AA7B]/10 px-3 py-1 rounded-lg">
                <Star size={18} className="text-[#A2AA7B] fill-[#A2AA7B]" />
                <span className="font-semibold text-[#5C6748]">{rating}</span>
              </div>
            )}
          </div>

          {address && (
            <div className="flex items-start gap-3 mb-3 text-[#5C6748]/80">
              <MapPin size={20} className="text-[#A2AA7B] mt-0.5 flex-shrink-0" />
              <span className="text-base">{address}</span>
            </div>
          )}

          {phone && (
            <div className="flex items-center gap-3 text-[#5C6748]/80">
              <Phone size={20} className="text-[#A2AA7B] flex-shrink-0" />
              <span className="text-base">{phone}</span>
            </div>
          )}
        </div>

        {/* Hours Card */}
        {hours && hours.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} className="text-[#A2AA7B]" />
              <h2 className="text-lg font-semibold text-[#5C6748]">Hours</h2>
            </div>
            <div className="space-y-2">
              {hours.map((h, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-[#E7EAE5] last:border-0">
                  <span className="font-medium text-[#5C6748]">{h.day}</span>
                  <span className="text-[#5C6748]/70">{h.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doctors Card */}
        {doctors && doctors.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className="text-[#A2AA7B]" />
              <h2 className="text-lg font-semibold text-[#5C6748]">Doctors</h2>
            </div>
            <div className="space-y-3">
              {doctors.map((d, idx) => (
                <div key={idx} className="p-3 bg-[#F5F7F0] rounded-lg">
                  <div className="font-semibold text-[#5C6748]">{d.name}</div>
                  {d.specialty && <div className="text-sm text-[#5C6748]/70 mt-1">{d.specialty}</div>}
                  {d.phone && <div className="text-sm text-[#5C6748]/70 mt-1">Phone: {d.phone}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map Card */}
        {lat !== 0 && lng !== 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-[#5C6748] mb-4">Location</h2>
            <div className="w-full h-96 rounded-lg overflow-hidden">
              <iframe
                title="map"
                src={mapSrc}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserClinicDetail;

