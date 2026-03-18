import React, { useEffect, useState } from "react";
import AdminNavbar from "../AdminComponent/AdminNavbar";
import { toast } from "react-toastify";
import { getAuthHeaders } from "../utils/authFetch";

type AdminUserRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
};

const AdminUser: React.FC = () => {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/users", {
          headers: getAuthHeaders() as Record<string, string>,
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message || "Failed to load users");
          return;
        }
        setUsers(data.users || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this user from the list?")) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders() as Record<string, string>,
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to delete user");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users
    // show only non-admin users
    .filter((user) => user.role !== "admin")
    .filter((user) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.phone.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex min-h-screen bg-[#f4f0ea]">
      <AdminNavbar />

      <main className="flex-1 px-6 lg:px-10 py-8 overflow-y-auto">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2b1b1b]">
            Users
          </h1>
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-1.5 shadow-sm border border-[#e6ddd0] max-w-xs w-full sm:w-64">
            <span className="text-xs font-semibold tracking-[0.18em] text-gray-500">
              SEARCH
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none"
           
            />
          </div>
        </header>

        <section className="rounded-2xl bg-white shadow-sm border border-[#e6ddd0] px-4 sm:px-6 py-5">
          {filteredUsers.length === 0 ? (
            <p className="text-sm text-gray-700">
              No users found. Customers will appear here after they sign up.
            </p>
          ) : (
            <div className="overflow-x-auto text-sm text-gray-800">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead className="text-xs uppercase tracking-[0.16em] text-gray-500">
                  <tr>
                    <th className="text-left">ID</th>
                    <th className="text-left">Name</th>
                    <th className="text-left">Email</th>
                    <th className="text-left">Phone</th>
                    <th className="text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id} className="align-middle">
                      <td className="py-1 pr-4">{index + 1}</td>
                     <td className="py-1 pr-4">{user.name}</td>
                      <td className="py-1 pr-4 wrap-break-word max-w-[200px]">
                        {user.email}
                      </td>
                      <td className="py-1 pr-4">{user.phone}</td>
                      <td className="py-1">
                        <button
                          type="button"
                          onClick={() => handleDelete(user.id)}
                          className="rounded-full border border-red-500 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                        >
                          DELETE
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminUser;