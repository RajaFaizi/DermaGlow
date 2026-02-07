import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClinic } from "../../utils/api";
import { ArrowLeft } from "lucide-react";

const ClinicDetail = () => {
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

  if (loading) return <div className="p-4">Loading...</div>;
  if (!clinic) return <div className="p-4">Not found</div>;

  const { name, rating, address, phone, hours, coordinates } = clinic;
  const lat = Number(coordinates?.lat || 0);
  const lng = Number(coordinates?.lng || 0);
  const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/clinics")}
        className="flex items-center gap-2 text-[#5C6748] hover:text-[#A2AA7B] transition-colors mb-4"
      >
        <ArrowLeft size={20} />
        <span>Back to Clinics</span>
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-[#E7EAE5] p-6">
        <h1 className="text-2xl font-bold text-[#5C6748] mb-4">{name}</h1>
        <div className="space-y-2">
          <div className="text-[#8C9669]">Rating: <span className="font-semibold text-[#5C6748]">{rating || 0}</span></div>
          <div className="text-[#8C9669]">{address}</div>
          <div className="text-[#8C9669]">Phone: <span className="font-semibold text-[#5C6748]">{phone}</span></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E7EAE5] p-6">
        <h2 className="text-xl font-bold text-[#5C6748] mb-4">Operating Hours</h2>
        <div className="space-y-2">
          {(hours || []).map((h, idx) => (
            <div key={idx} className="flex justify-between py-2 border-b border-[#E7EAE5] last:border-0">
              <span className="font-semibold text-[#5C6748]">{h.day}</span>
              <span className="text-[#8C9669]">{h.label}</span>
            </div>
          ))}
          {(!hours || hours.length === 0) && <div className="text-[#8C9669]">No hours provided</div>}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E7EAE5] p-6">
        <h2 className="text-xl font-bold text-[#5C6748] mb-4">Location</h2>
        <div className="w-full h-80 rounded-lg overflow-hidden">
          <iframe
            title="map"
            src={mapSrc}
            className="w-full h-full"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default ClinicDetail;


