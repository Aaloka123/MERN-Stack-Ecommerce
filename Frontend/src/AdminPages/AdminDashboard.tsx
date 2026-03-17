import React from "react";
import AdminNavbar from "../AdminComponent/AdminNavbar";

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#f4f0ea]">
      <AdminNavbar />

      <main className="flex-1 px-6 lg:px-10 py-8 overflow-y-auto">
        <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2b1b1b]">
              Dashboard
            </h1>

          </div>
          <p className="text-xs tracking-[0.18em] uppercase text-gray-600">
            Today · {new Date().toLocaleDateString()}
          </p>
        </header>

        {/* Top stats cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-2xl bg-white px-4 py-5 shadow-sm border border-[#e6ddd0]">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
              Revenue
            </p>
            <p className="mt-2 text-xl font-extrabold text-[#7b1b2b]">
              Rs. 86,400
            </p>
            <p className="mt-1 text-xs text-emerald-600">+18% vs yesterday</p>
          </div>

          <div className="rounded-2xl bg-white px-4 py-5 shadow-sm border border-[#e6ddd0]">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
              Orders
            </p>
            <p className="mt-2 text-xl font-extrabold text-[#7b1b2b]">142</p>
            <p className="mt-1 text-xs text-emerald-600">+9% vs yesterday</p>
          </div>

          <div className="rounded-2xl bg-white px-4 py-5 shadow-sm border border-[#e6ddd0]">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
              New customers
            </p>
            <p className="mt-2 text-xl font-extrabold text-[#7b1b2b]">37</p>
            <p className="mt-1 text-xs text-gray-600">Mostly returning visitors</p>
          </div>

          <div className="rounded-2xl bg-white px-4 py-5 shadow-sm border border-[#e6ddd0]">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
              Refund rate
            </p>
            <p className="mt-2 text-xl font-extrabold text-[#7b1b2b]">1.2%</p>
            <p className="mt-1 text-xs text-emerald-600">Healthy</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {/* Pie chart card */}
          <div className="rounded-2xl bg-white shadow-sm border border-[#e6ddd0] px-6 py-5 flex flex-col">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
              Sales by category
            </p>

            <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
              {/* Simple donut chart using SVG */}
              <svg
                viewBox="0 0 36 36"
                className="h-32 w-32 text-[#e6ddd0]"
              >
                <circle
                  className="fill-none stroke-current"
                  strokeWidth="3"
                  cx="18"
                  cy="18"
                  r="15.9155"
                />
                <circle
                  className="fill-none stroke-[#7b1b2b]"
                  strokeWidth="3"
                  strokeDasharray="45 55"
                  strokeDashoffset="25"
                  strokeLinecap="round"
                  cx="18"
                  cy="18"
                  r="15.9155"
                />
                <circle
                  className="fill-none stroke-[#c87a5b]"
                  strokeWidth="3"
                  strokeDasharray="30 70"
                  strokeDashoffset="-20"
                  strokeLinecap="round"
                  cx="18"
                  cy="18"
                  r="15.9155"
                />
                <circle
                  className="fill-none stroke-[#e0a96d]"
                  strokeWidth="3"
                  strokeDasharray="25 75"
                  strokeDashoffset="-55"
                  strokeLinecap="round"
                  cx="18"
                  cy="18"
                  r="15.9155"
                />
              </svg>

              <div className="flex-1 space-y-2 text-sm text-gray-800">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#7b1b2b]" />
                    Women
                  </span>
                  <span className="font-semibold">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#c87a5b]" />
                    Men
                  </span>
                  <span className="font-semibold">30%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#e0a96d]" />
                    Accessories
                  </span>
                  <span className="font-semibold">25%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent orders */}
          <div className="rounded-2xl bg-white shadow-sm border border-[#e6ddd0] px-6 py-5 lg:col-span-2">
            <p className="text-sm uppercase tracking-[0.18em] text-gray-500 mb-4">
              Recent orders
            </p>
            <div className="overflow-x-auto text-sm text-gray-800">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead className="text-xs uppercase tracking-[0.16em] text-gray-500">
                  <tr>
                    <th className="text-left">Order</th>
                    <th className="text-left">Customer</th>
                    <th className="text-left">Total</th>
                    <th className="text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: "#A1024",
                      customer: "Saanvi Patel",
                      total: "Rs. 5,400",
                      status: "Packed",
                    },
                    {
                      id: "#A1023",
                      customer: "Arjun Mehra",
                      total: "Rs. 11,200",
                      status: "Shipped",
                    },
                    {
                      id: "#A1022",
                      customer: "Meera Iyer",
                      total: "Rs. 3,950",
                      status: "Delivered",
                    },
                  ].map((order) => (
                    <tr key={order.id} className="align-middle">
                      <td className="py-1">{order.id}</td>
                      <td className="py-1">{order.customer}</td>
                      <td className="py-1">{order.total}</td>
                      <td className="py-1">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;