import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listClinics } from "../../utils/api";
import { MapPin, Phone, Star, Clock } from "lucide-react";

const ExploreClinics = () => {
  const [data, setData] = useState({ items: [], page: 1, limit: 20, total: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const res = await listClinics({ page: 1, limit: 50 });
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-white to-[#F5F7F0] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#5C6748] mb-2">Explore Clinics</h1>
          <p className="text-[#5C6748]/70">Find the best skincare clinics and hospitals near you</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#5C6748]">Loading clinics...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/clinic/${c.id}`)}
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-semibold text-[#5C6748] flex-1">{c.name}</h3>
                    {c.rating > 0 && (
                      <div className="flex items-center gap-1 bg-[#A2AA7B]/10 px-2 py-1 rounded">
                        <Star size={14} className="text-[#A2AA7B] fill-[#A2AA7B]" />
                        <span className="text-sm font-medium text-[#5C6748]">{c.rating}</span>
                      </div>
                    )}
                  </div>

                  {c.address && (
                    <div className="flex items-start gap-2 text-sm text-[#5C6748]/70">
                      <MapPin size={16} className="text-[#A2AA7B] mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{c.address}</span>
                    </div>
                  )}

                  {c.phone && (
                    <div className="flex items-center gap-2 text-sm text-[#5C6748]/70">
                      <Phone size={16} className="text-[#A2AA7B] flex-shrink-0" />
                      <span>{c.phone}</span>
                    </div>
                  )}

                  {c.hours && c.hours.length > 0 && (
                    <div className="flex items-start gap-2 text-sm text-[#5C6748]/70">
                      <Clock size={16} className="text-[#A2AA7B] mt-0.5 flex-shrink-0" />
                      <div>
                        {c.hours[0]?.label && (
                          <span>{c.hours[0].label}</span>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/clinic/${c.id}`);
                    }}
                    className="w-full mt-4 px-4 py-2 bg-[#A2AA7B] text-white rounded-lg hover:bg-[#8B936A] transition-colors duration-200 font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && data.items.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-[#5C6748]/70">No clinics available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreClinics;

