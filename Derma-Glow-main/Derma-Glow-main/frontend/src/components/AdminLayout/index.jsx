import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogOut, Building2, User, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      setUser(parsed);
    }
    setLoading(false);
  }, []);

  const onLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAF5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#A2AA7B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#5C6748]">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { icon: Building2, label: 'Clinics', path: '/admin/clinics', active: location.pathname.startsWith('/admin/clinics') },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF5] flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg border-r border-[#E7EAE5] transition-all duration-300 flex flex-col`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-[#E7EAE5]">
          <div className="flex items-center justify-between">
            {sidebarOpen ? (
              <div>
                <h1 className="text-lg font-bold text-[#5C6748]">Derma Glow</h1>
                <p className="text-xs text-[#8C9669]">Admin Panel</p>
              </div>
            ) : (
              <div></div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[#F5F7F0] rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={20} className="text-[#5C6748]" /> : <Menu size={20} className="text-[#5C6748]" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  item.active
                    ? 'bg-[#A2AA7B] text-white shadow-md'
                    : 'text-[#5C6748] hover:bg-[#F5F7F0]'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-[#E7EAE5] space-y-3">
          <div className={`flex items-center gap-3 p-3 rounded-lg bg-[#F5F7F0] ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 bg-[#A2AA7B] rounded-full flex items-center justify-center">
              <User className="text-white" size={18} />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#5C6748] truncate">{user.fullName || 'Admin'}</p>
                <p className="text-xs text-[#8C9669]">Administrator</p>
              </div>
            )}
          </div>
          <button
            onClick={onLogOut}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md ${!sidebarOpen && 'justify-center'}`}
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-[#E7EAE5] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#5C6748]">
                {location.pathname === '/admin/clinics' ? 'Clinics Management' : 'Admin Dashboard'}
              </h2>
              <p className="text-sm text-[#8C9669] mt-1">Manage your clinics and settings</p>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

