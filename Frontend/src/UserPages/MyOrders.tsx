import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Component/Header";
import Footer from "../Component/Footer";

const API = "http://localhost:5000/api/auth";

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

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("currentUser");
      if (!raw) {
        navigate("/login", { replace: true });
        return;
      }
      const user = JSON.parse(raw) as { email?: string };
      if (user?.email) setUserEmail(user.email);
      else navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!userEmail) return;
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${API}/orders?email=${encodeURIComponent(userEmail)}`
        );
        const data = await res.json();
        if (res.ok && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userEmail]);

  // Fetch product images once (for older orders that may not have image stored)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/products`);
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
        // ignore, fallback to images stored on order items
      }
    };
    fetchProducts();
  }, []);

  const handleCancel = async (orderId: string) => {
    if (!userEmail) return;
    if (!window.confirm("Cancel this order?")) return;
    setCancellingId(orderId);
    try {
      const res = await fetch(`${API}/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: "cancelled" } : o
          )
        );
      } else if (data.message) {
        alert(data.message);
      }
    } catch {
      // ignore for now
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const shortId = (id: string) => (id.length > 8 ? id.slice(-8) : id);

  return (
    <div className="min-h-screen bg-[#fdedd6]">
      <Header />

      <main className="px-6 lg:px-20 py-10">
        <h1 className="text-2xl font-extrabold text-[#7b1b2b] tracking-tight mb-2">
          My Orders
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Track your purchase orders and view status.
        </p>

        {loading ? (
          <p className="text-sm text-gray-700">Loading your orders...</p>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl bg-[#f7ddbc] p-8 text-center">
            <p className="text-gray-700 mb-4">You haven&apos;t placed any orders yet.</p>
            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="rounded-full bg-[#7b1b2b] px-5 py-2 text-sm font-semibold text-white hover:bg-[#5c131f] transition-colors"
            >
              Browse Shop
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl bg-[#f7ddbc] border border-[#e2c9a5] overflow-hidden"
              >
                <div className="w-full px-4 py-4 flex items-center justify-between gap-3 hover:bg-[#f0d4b0] transition-colors">
                  {/* Left: date, status, total, cancel */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </span>
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelled"
                          ? "bg-gray-200 text-gray-700"
                          : order.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                    <span className="font-semibold text-[#2b1b1b]">
                      Rs. {order.total.toLocaleString("en-IN")}
                    </span>
                    {["pending", "confirmed"].includes(order.status) && (
                      <button
                        type="button"
                        disabled={cancellingId === order.id}
                        onClick={() => handleCancel(order.id)}
                        className="rounded-full border border-red-200 bg-red-50 px-4 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors disabled:opacity-60"
                      >
                        {cancellingId === order.id ? "Cancelling..." : "Cancel order"}
                      </button>
                    )}
                  </div>

                  {/* Right: view details toggle */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId((prev) => (prev === order.id ? null : order.id))
                    }
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label={
                      expandedId === order.id ? "Hide order details" : "View order details"
                    }
                  >
                    <span
                      className={`transform transition-transform ${
                        expandedId === order.id ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                </div>
                {expandedId === order.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-[#e2c9a5]">
                    <ul className="mt-3 space-y-2 text-sm text-gray-800">
                      {order.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center"
                        >
                          <div className="flex items-center gap-3">
                            {(() => {
                              const imgSrc =
                                item.image ||
                                (item.productId
                                  ? productImages[item.productId]
                                  : "");
                              return imgSrc ? (
                                <div className="h-16 w-16 rounded-md bg-[#e0c79f] overflow-hidden flex items-center justify-center">
                                  <img
                                    src={imgSrc}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ) : null;
                            })()}
                            <span>
                              {item.name} × {item.qty}
                            </span>
                          </div>
                          <span>
                            Rs.{" "}
                            {(item.price * item.qty).toLocaleString("en-IN")}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 pt-2 border-t border-[#e2c9a5] flex justify-between text-sm text-gray-700">
                      <span>Subtotal</span>
                      <span>Rs. {order.subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>Tax</span>
                      <span>Rs. {order.tax.toLocaleString("en-IN")}</span>
                    </div>
                    {order.shippingAddress && (
                      <p className="mt-2 text-xs text-gray-600">
                        <span className="font-medium">Shipping:</span>{" "}
                        {order.shippingAddress}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyOrders;
