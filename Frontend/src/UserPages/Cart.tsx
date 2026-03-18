import React, { useState, useEffect } from "react";
import Header from "../Component/Header";
import Footer from "../Component/Footer";

const API = "http://localhost:5000/api/auth";

type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  stock?: number;
};

const Cart: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("currentUser");
    if (raw) {
      try {
        const user = JSON.parse(raw) as { email?: string };
        if (user?.email) setUserEmail(user.email);
      } catch {
        setUserEmail(null);
      }
    } else {
      setUserEmail(null);
    }
  }, []);

  useEffect(() => {
    if (!userEmail) {
      setItems([]);
      setLoading(false);
      return;
    }
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API}/cart?email=${encodeURIComponent(userEmail)}`);
        const data = await res.json();
        if (res.ok && data.cart?.items) {
          setItems(data.cart.items);
        } else {
          setItems([]);
        }
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [userEmail]);

  const updateCartFromResponse = (cart: { items: CartItem[] }) => {
    if (cart?.items) setItems(cart.items);
  };

  const handleChangeQty = async (productId: string, delta: number) => {
    if (!userEmail) return;
    const item = items.find((i) => i.productId === productId);
    if (!item) return;
    const maxQty = typeof item.stock === "number" ? item.stock : item.qty + delta;
    const newQty = Math.max(1, Math.min(item.qty + delta, maxQty));
    try {
      const res = await fetch(`${API}/cart/item`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, productId, qty: newQty }),
      });
      const data = await res.json();
      if (res.ok && data.cart) updateCartFromResponse(data.cart);
    } catch {
      // keep local state on error
    }
  };

  const handleRemove = async (productId: string) => {
    if (!userEmail) return;
    try {
      const res = await fetch(
        `${API}/cart/item?email=${encodeURIComponent(userEmail)}&productId=${encodeURIComponent(productId)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok && data.cart) updateCartFromResponse(data.cart);
    } catch {
      // keep local state on error
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = Math.round(subtotal * 0.13);
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-[#fdedd6]">
      <Header />

      <main className="px-6 lg:px-20 py-10">
        <h1 className="text-2xl font-extrabold text-[#7b1b2b] tracking-tight mb-6">
          Your Bag
        </h1>

        {!userEmail && !loading && (
          <p className="text-sm text-gray-700 py-6">
            Please log in to view and manage your cart.
          </p>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <section className="flex-1 bg-[#f7ddbc] rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
            {loading && userEmail && (
              <p className="text-sm text-gray-700 text-center py-6">
                Loading your bag...
              </p>
            )}
            {!loading && userEmail && items.length > 0 && items.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e2c9a5] pb-4 last:border-none"
              >
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-xl bg-[#e0c79f] overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">No image</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                      {item.name}
                    </h2>
                    <p className="text-xs text-gray-600 mt-1">
                      Qty: {item.qty}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="flex items-center rounded-full border border-[#e2c9a5] px-4 py-2 text-sm text-gray-800">
                    <button
                      type="button"
                      className="px-2"
                      onClick={() => handleChangeQty(item.productId, -1)}
                    >
                      -
                    </button>
                    <span className="px-3">{item.qty}</span>
                    <button
                      type="button"
                      className="px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleChangeQty(item.productId, 1)}
                      disabled={typeof item.stock === "number" && item.qty >= item.stock}
                      title={typeof item.stock === "number" && item.qty >= item.stock ? "Maximum stock reached" : undefined}
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-[#7b1b2b]">
                    Rs. {(item.price * item.qty).toLocaleString("en-IN")}.00
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.productId)}
                    className="p-2 rounded-lg text-gray-500 hover:text-[#7b1b2b] hover:bg-[#e2c9a5] transition-colors"
                    title="Remove from bag"
                    aria-label="Remove from bag"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            {!loading && userEmail && items.length === 0 && (
              <p className="text-sm text-gray-700 text-center py-6">
                Your bag is empty. Start exploring our collections.
              </p>
            )}
          </section>

          {/* Summary */}
          {userEmail && (
            <aside className="w-full lg:w-80 bg-[#f7ddbc] rounded-2xl shadow-sm p-5 h-fit">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7b1b2b] mb-4">
                Summary
              </h2>

              <div className="space-y-3 text-sm text-gray-800">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString("en-IN")}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (13%)</span>
                  <span>Rs. {tax.toLocaleString("en-IN")}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-gray-600">Calculated at checkout</span>
                </div>
                <div className="border-t border-[#e2c9a5] pt-3 flex justify-between font-semibold text-[#7b1b2b]">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString("en-IN")}.00</span>
                </div>
              </div>

              <button
                disabled={items.length === 0}
                className="mt-6 w-full rounded-full bg-[#7b1b2b] px-4 py-3 text-xs font-semibold tracking-[0.16em] text-white hover:bg-[#5c131f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                PROCEED TO CHECKOUT
              </button>
            </aside>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
