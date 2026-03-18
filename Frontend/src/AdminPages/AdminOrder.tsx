import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminNavbar from "../AdminComponent/AdminNavbar";
import { getAuthHeaders, getJsonAuthHeaders } from "../utils/authFetch";

const API = "http://localhost:5000/api/admin";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

type Order = {
  id: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  shippingAddress: string;
  createdAt: string;
};

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const AdminOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<Record<string, string>>({});

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/orders`, {
        headers: getAuthHeaders() as Record<string, string>,
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        toast.error(data.message || "Failed to load orders");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // fetch product images for orders that may not have image stored on items
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API.replace("/api/admin", "/api/auth")}/products`);
        const data = await res.json();
        if (res.ok && Array.isArray(data.products)) {
          const map: Record<string, string> = {};
          data.products.forEach((p: any) => {
            if (p.id && (p.image || (p.images && p.images[0]))) {
              map[p.id] = p.image || p.images[0];
            }
          });
          setProductImages(map);
        }
      } catch {
        // ignore; fall back to item.image only
      }
    };
    fetchProducts();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API}/orders/${orderId}`, {
        method: "PATCH",
        headers: getJsonAuthHeaders() as Record<string, string>,
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        toast.success("Order status updated");
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shortId = (id: string) => (id.length > 8 ? id.slice(-8) : id);

  const filteredOrders = search.trim()
    ? orders.filter((order) => {
        const term = search.trim().toLowerCase();
        const idMatch = order.id.toLowerCase().includes(term) || shortId(order.id).toLowerCase().includes(term);
        const emailMatch = order.userEmail.toLowerCase().includes(term);
        const statusMatch = order.status.toLowerCase().includes(term);
        const totalMatch = String(order.total).includes(term);
        const itemNamesMatch = order.items.some((i) => i.name.toLowerCase().includes(term));
        return idMatch || emailMatch || statusMatch || totalMatch || itemNamesMatch;
      })
    : orders;

  return (
    <div className="flex min-h-screen bg-[#f4f0ea]">
      <AdminNavbar />

      <main className="flex-1 px-6 lg:px-10 py-8 overflow-y-auto">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2b1b1b]">
              Orders
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              View and update order status from customers.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm border border-[#e6ddd0] max-w-xs w-full sm:w-72">
            <span className="text-xs font-semibold tracking-[0.12em] text-gray-500 shrink-0">
              SEARCH
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none min-w-0"
            />
          </div>
        </header>

        <section className="rounded-2xl bg-white shadow-sm border border-[#e6ddd0] px-4 sm:px-6 py-5">
          {loading ? (
            <p className="text-sm text-gray-700">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-gray-700">No orders yet. Orders will appear here when customers checkout.</p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-sm text-gray-700">No orders match your search. Try order ID, customer email, status, or total.</p>
          ) : (
            <div className="overflow-x-auto text-sm text-gray-800">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead className="text-xs uppercase tracking-[0.16em] text-gray-500">
                  <tr>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Order</th>
                    <th className="text-left py-2">Customer</th>
                    <th className="text-left py-2">Items</th>
                    <th className="text-left py-2">Total</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr className="align-middle bg-[#fdfbf8] hover:bg-[#faf6f0]">
                        <td className="py-3 pr-4 whitespace-nowrap text-gray-600">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-3 pr-4 font-mono text-xs text-[#7b1b2b]">
                          #{shortId(order.id)}
                        </td>
                        <td className="py-3 pr-4">{order.userEmail}</td>
                        <td className="py-3 pr-4">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </td>
                        <td className="py-3 pr-4 font-semibold text-[#7b1b2b]">
                          Rs. {order.total.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 pr-4">
                          {(() => {
                            const base =
                              "rounded-full border px-3 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#7b1b2b] disabled:opacity-60";
                            const colorClass =
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : order.status === "cancelled"
                                ? "bg-gray-200 text-gray-700 border-gray-300"
                                : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : "bg-amber-100 text-amber-800 border-amber-200"; // pending / confirmed

                            return (
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  handleStatusChange(order.id, e.target.value)
                                }
                                disabled={
                                  updatingId === order.id || order.status === "cancelled"
                                }
                                className={`${base} ${colorClass}`}
                              >
                                {STATUS_OPTIONS.filter((s) => {
                                  // Show 'cancelled' only when the order is already cancelled,
                                  // so admin can see it but not move orders into cancelled.
                                  if (s === "cancelled" && order.status !== "cancelled") {
                                    return false;
                                  }
                                  const currentIndex = STATUS_OPTIONS.indexOf(order.status);
                                  const optionIndex = STATUS_OPTIONS.indexOf(s);
                                  // Only allow current or forward statuses in the dropdown
                                  return optionIndex >= currentIndex;
                                }).map((s) => (
                                  <option key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                  </option>
                                ))}
                              </select>
                            );
                          })()}
                          {updatingId === order.id && (
                            <span className="ml-1 text-xs text-gray-500">Updating...</span>
                          )}
                        </td>
                        <td className="py-3">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId((prev) => (prev === order.id ? null : order.id))
                            }
                            className="rounded-full border border-[#7b1b2b] px-3 py-1 text-xs font-semibold text-[#7b1b2b] hover:bg-[#7b1b2b] hover:text-white transition-colors"
                          >
                            {expandedId === order.id ? "Hide details" : "View details"}
                          </button>
                        </td>
                      </tr>
                      {expandedId === order.id && (
                        <tr>
                          <td colSpan={7} className="pb-4 pt-0">
                            <div className="rounded-xl bg-[#f7f3ed] border border-[#e6ddd0] p-4 text-sm">
                              {order.shippingAddress && (
                                <p className="mb-2">
                                  <span className="font-medium text-gray-700">Shipping:</span>{" "}
                                  {order.shippingAddress || "—"}
                                </p>
                              )}
                              <p className="font-medium text-gray-700 mb-2">Items:</p>
                              <ul className="space-y-2">
                                {order.items.map((item, idx) => {
                                  const imgSrc =
                                    item.image ||
                                    (item.productId
                                      ? productImages[item.productId]
                                      : "");
                                  return (
                                    <li
                                      key={idx}
                                      className="flex justify-between items-center text-gray-800"
                                    >
                                      <div className="flex items-center gap-3">
                                        {imgSrc && (
                                          <div className="h-16 w-16 rounded-md bg-[#e0c79f] overflow-hidden flex items-center justify-center">
                                            <img
                                              src={imgSrc}
                                              alt={item.name}
                                              className="h-full w-full object-cover"
                                            />
                                          </div>
                                        )}
                                        <span>
                                          {item.name} × {item.qty}
                                        </span>
                                      </div>
                                      <span>
                                        Rs.{" "}
                                        {(item.price * item.qty).toLocaleString(
                                          "en-IN"
                                        )}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                              <div className="mt-2 pt-2 border-t border-[#e2c9a5] flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span>Rs. {order.subtotal.toLocaleString("en-IN")}</span>
                              </div>
                              <div className="flex justify-between text-gray-700">
                                <span>Tax (13%)</span>
                                <span>Rs. {order.tax.toLocaleString("en-IN")}</span>
                              </div>
                              <div className="flex justify-between font-semibold text-[#7b1b2b]">
                                <span>Total</span>
                                <span>Rs. {order.total.toLocaleString("en-IN")}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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

export default AdminOrder;
