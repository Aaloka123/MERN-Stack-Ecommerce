import React, { useState } from "react";
import AdminNavbar from "../AdminComponent/AdminNavbar";

type AdminUserRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
};

const STATIC_USERS: AdminUserRecord[] = [
  {
    id: "U-101",
    fullName: "Aaloka Demo",
    email: "aaloka@example.com",
    phone: "9876543210",
  },
  {
    id: "U-102",
    fullName: "Saanvi Patel",
    email: "saanvi@example.com",
    phone: "9876501234",
  },
  {
    id: "U-103",
    fullName: "Arjun Mehra",
    email: "arjun@example.com",
    phone: "9876512345",
  },
];

const AdminUser: React.FC = () => {
  const [users, setUsers] = useState<AdminUserRecord[]>(STATIC_USERS);
  const [search, setSearch] = useState("");
  const handleDelete = (id: string) => {
    if (!window.confirm("Remove this user from the list?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const filteredUsers = users.filter((user) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      user.fullName.toLowerCase().includes(term) ||
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
                    <th className="text-left">Name</th>
                    <th className="text-left">Email</th>
                    <th className="text-left">Phone</th>
                    <th className="text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="align-middle">
                      <td className="py-1 pr-4">{user.fullName}</td>
                      <td className="py-1 pr-4 break-words max-w-[200px]">
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