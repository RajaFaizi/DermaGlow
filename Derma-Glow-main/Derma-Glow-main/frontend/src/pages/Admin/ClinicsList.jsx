import React, { useEffect, useState } from "react";
import { listClinics, deleteClinic } from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Star, MapPin, Phone, Plus, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { confirmationAlert } from "../../utils/swal";

const ClinicsList = () => {
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

  const onDelete = async (id) => {
    confirmationAlert(
      async () => {
        try {
          await deleteClinic(id);
          load();
        } catch (error) {
          console.error("Error deleting clinic:", error);
        }
      },
      "Are you sure you want to delete this clinic? This action cannot be undone."
    );
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#5C6748] mb-2">Clinics Management</h1>
          <p className="text-[#8C9669]">Manage and organize all your clinics</p>
        </div>
        <Link
          to="/admin/clinics/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#A2AA7B] text-white rounded-lg hover:bg-[#8B936A] transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
          <Plus size={20} />
          <span>Add New Clinic</span>
        </Link>
      </div>

      {/* Clinics List */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-[#E7EAE5] p-12 flex flex-col items-center justify-center">
          <Loader2 className="text-[#A2AA7B] animate-spin mb-4" size={40} />
          <p className="text-[#5C6748]">Loading clinics...</p>
        </div>
      ) : data.items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-[#E7EAE5] p-12 text-center">
          <Building2 className="text-[#A2AA7B] mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold text-[#5C6748] mb-2">No clinics found</h3>
          <p className="text-[#8C9669] mb-6">Get started by adding your first clinic</p>
          <Link
            to="/admin/clinics/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A2AA7B] text-white rounded-lg hover:bg-[#8B936A] transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            <Plus size={20} />
            <span>Add Your First Clinic</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.items.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl shadow-sm border border-[#E7EAE5] hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#5C6748] mb-2 line-clamp-2">{c.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="text-yellow-400 fill-yellow-400" size={16} />
                      <span className="text-sm font-semibold text-[#5C6748]">{c.rating || 0}</span>
                      <span className="text-xs text-[#8C9669]">/ 5.0</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {c.address && (
                    <div className="flex items-start gap-2 text-sm text-[#8C9669]">
                    <MapPin className="text-[#A2AA7B] mt-0.5 flex-shrink-0" size={16} />
                    <span className="line-clamp-2">{c.address}</span>
                  </div>
                  )}
                  {c.phone && (
                    <div className="flex items-center gap-2 text-sm text-[#8C9669]">
                      <Phone className="text-[#A2AA7B] flex-shrink-0" size={16} />
                      <span>{c.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-[#E7EAE5]">
                  <button
                    onClick={() => navigate(`/admin/clinics/${c.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#F5F7F0] text-[#5C6748] rounded-lg hover:bg-[#E7EAE5] transition-colors text-sm font-medium"
                  >
                    <Eye size={16} />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => navigate(`/admin/clinics/${c.id}/edit`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#A2AA7B] text-white rounded-lg hover:bg-[#8B936A] transition-colors text-sm font-medium"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(c.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClinicsList;


