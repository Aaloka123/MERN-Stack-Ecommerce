import React, { useEffect, useMemo, useState } from "react";
import AdminNavbar from "../AdminComponent/AdminNavbar";
import { getAuthHeaders } from "../utils/authFetch";

const API_ADMIN = "http://localhost:5000/api/admin";
const API_AUTH = "http://localhost:5000/api/auth";

type OrderSummary = {
  id: string;
  userEmail: string;
  total: number;
  status: string;
  createdAt: string;
};

type UserSummary = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
};

type ProductSummary = {
  id: string;
  category: string;
  price: number;
  stock: number;
};

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          fetch(`${API_ADMIN}/orders`, {
            headers: getAuthHeaders() as Record<string, string>,
          }),
          fetch(`${API_ADMIN}/users`, {
            headers: getAuthHeaders() as Record<string, string>,
          }),
          fetch(`${API_AUTH}/products`),
        ]);

        const [ordersData, usersData, productsData] = await Promise.all([
          ordersRes.json(),
          usersRes.json(),
          productsRes.json(),
        ]);

        if (ordersRes.ok && Array.isArray(ordersData.orders)) {
          setOrders(
            ordersData.orders.map((o: any) => ({
              id: o.id,
              userEmail: o.userEmail,
              total: o.total,
              status: o.status,
              createdAt: o.createdAt,
            }))
          );
        }

        if (usersRes.ok && Array.isArray(usersData.users)) {
          setUsers(
            usersData.users.map((u: any) => ({
              id: u.id,
              email: u.email,
              role: u.role,
              createdAt: u.createdAt,
            }))
          );
        }

        if (productsRes.ok && Array.isArray(productsData.products)) {
          setProducts(
            productsData.products.map((p: any) => ({
              id: p.id,
              category: p.category,
              price: p.price,
              stock: typeof p.stock === "number" ? p.stock : 0,
            }))
          );
        }
      } catch {
        // ignore errors; show whatever data we have
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const totalRevenue = useMemo(
    () =>
      orders
        .filter((o) => o.status !== "cancelled")
        .reduce(
          (sum, o) => sum + (typeof o.total === "number" ? o.total : 0),
          0
        ),
    [orders]
  );

  const totalOrders = orders.length;
  const totalCustomers = users.filter((u) => u.role !== "admin").length;

  const categoryShares = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    const total = Object.values(counts).reduce((s, v) => s + v, 0) || 1;
    return {
      women: Math.round(((counts["Women"] || 0) / total) * 100),
      men: Math.round(((counts["Men"] || 0) / total) * 100),
      accessories: Math.round(((counts["Accessories"] || 0) / total) * 100),
    };
  }, [products]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 5),
    [orders]
  );

  return (
    <div className="flex min-h-screen bg-[#f4f0ea]">
      <AdminNavbar />

      <main className="flex-1 px-6 lg:px-10 py-8 overflow-y-auto">
        <header className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2b1b1b]">
              Dashboard
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Overview of orders, customers, and products.
            </p>
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
              Rs. {totalRevenue.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-gray-600">
              {loading ? "Calculating..." : "All-time revenue (non-cancelled orders)"}
            </p>
          </div>

          <div className="rounded-2xl bg-white px-4 py-5 shadow-sm border border-[#e6ddd0]">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
              Orders
            </p>
            <p className="mt-2 text-xl font-extrabold text-[#7b1b2b]">
              {totalOrders}
            </p>
            <p className="mt-1 text-xs text-gray-600">
              {loading ? "" : "Total orders in system"}
            </p>
          </div>

          <div className="rounded-2xl bg-white px-4 py-5 shadow-sm border border-[#e6ddd0]">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
              Customers
            </p>
            <p className="mt-2 text-xl font-extrabold text-[#7b1b2b]">
              {totalCustomers}
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Registered customers (excluding admins)
            </p>
          </div>

          <div className="rounded-2xl bg-white px-4 py-5 shadow-sm border border-[#e6ddd0]">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
              Products
            </p>
            <p className="mt-2 text-xl font-extrabold text-[#7b1b2b]">
              {products.length}
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Currently active products
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {/* Pie chart card */}
          <div className="rounded-2xl bg-white shadow-sm border border-[#e6ddd0] px-6 py-5 flex flex-col">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
              Sales by category
            </p>

            <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
              {/* Simple donut chart using SVG, driven by categoryShares */}
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
                  strokeDasharray={`${categoryShares.women} ${
                    100 - categoryShares.women
                  }`}
                  strokeDashoffset="25"
                  strokeLinecap="round"
                  cx="18"
                  cy="18"
                  r="15.9155"
                />
                <circle
                  className="fill-none stroke-[#c87a5b]"
                  strokeWidth="3"
                  strokeDasharray={`${categoryShares.men} ${
                    100 - categoryShares.men
                  }`}
                  strokeDashoffset="-20"
                  strokeLinecap="round"
                  cx="18"
                  cy="18"
                  r="15.9155"
                />
                <circle
                  className="fill-none stroke-[#e0a96d]"
                  strokeWidth="3"
                  strokeDasharray={`${categoryShares.accessories} ${
                    100 - categoryShares.accessories
                  }`}
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
                  <span className="font-semibold">
                    {categoryShares.women}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#c87a5b]" />
                    Men
                  </span>
                  <span className="font-semibold">
                    {categoryShares.men}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#e0a96d]" />
                    Accessories
                  </span>
                  <span className="font-semibold">
                    {categoryShares.accessories}%
                  </span>
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
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="align-middle">
                      <td className="py-1 font-mono text-xs text-[#7b1b2b]">
                        #{order.id.slice(-6)}
                      </td>
                      <td className="py-1">{order.userEmail}</td>
                      <td className="py-1">
                        Rs. {order.total.toLocaleString("en-IN")}
                      </td>
                      <td className="py-1">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "cancelled"
                              ? "bg-gray-200 text-gray-700"
                              : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
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