import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("ROLE");
    navigate("/login");
  };

  const linkBase =
    "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors";

  return (
    <aside className="sticky top-0 h-screen w-60 bg-[#7b1b2b] text-[#fdf4ee] flex flex-col border-r border-[#915066]">
      <div className="px-5 py-6 border-b border-[#915066]">
        <p className="text-lg font-extrabold leading-tight">Aaloka Admin</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
        <NavLink
          to="/admindashboard"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-[#fdf4ee] text-[#7b1b2b]"
                : "text-[#fdf4ee]/90 hover:bg-[#915066]"
            }`
          }
        >
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/adminproducts"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-[#fdf4ee] text-[#7b1b2b]"
                : "text-[#fdf4ee]/90 hover:bg-[#915066]"
            }`
          }
        >
          <span>Products</span>
        </NavLink>
        <NavLink
          to="/adminorders"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-[#fdf4ee] text-[#7b1b2b]"
                : "text-[#fdf4ee]/90 hover:bg-[#915066]"
            }`
          }
        >
          <span>Orders</span>
        </NavLink>
        <NavLink
          to="/adminusers"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-[#fdf4ee] text-[#7b1b2b]"
                : "text-[#fdf4ee]/90 hover:bg-[#915066]"
            }`
          }
        >   
          <span>Users</span>
        </NavLink>
        <NavLink
          to="/adminsettings"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-[#fdf4ee] text-[#7b1b2b]"
                : "text-[#fdf4ee]/90 hover:bg-[#915066]"
            }`
          }
        >
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="px-3 py-4 border-t border-[#915066]">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-full border border-[#fdf4ee] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[#fdf4ee] hover:bg-[#fdf4ee] hover:text-[#7b1b2b] transition-colors"
        >
          LOG OUT
        </button>
      </div>
    </aside>
  );
};

export default AdminNavbar;