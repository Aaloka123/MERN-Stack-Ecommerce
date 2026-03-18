import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../Component/Header";
import Footer from "../Component/Footer";

type Product = {
  id: string | number;
  name: string;
  category: string;
  price: number;
  image: string;
  stock?: number;
};

const API = "http://localhost:5000/api/auth";

const Shop = () => {
  const navigate = useNavigate();
  const [serverProducts, setServerProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<"under5" | "5to10" | "above10" | null>(
    null
  );
  const [sortBy, setSortBy] = useState<"featured" | "low" | "high" | "newest">(
    "featured"
  );
  const [addingId, setAddingId] = useState<string | number | null>(null);

  const getCurrentUserEmail = (): string | null => {
    try {
      const raw = sessionStorage.getItem("currentUser");
      if (!raw) return null;
      const user = JSON.parse(raw) as { email?: string };
      return user?.email || null;
    } catch {
      return null;
    }
  };

  const handleAddToBag = async (productId: string | number) => {
    const product = serverProducts.find((p) => p.id === productId);
    if (product && typeof product.stock === "number" && product.stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }
    const email = getCurrentUserEmail();
    if (!email) return;
    setAddingId(productId);
    try {
      const statusRes = await fetch(`${API}/store-status`);
      const statusData = await statusRes.json();
      if (statusData.storeClosed) {
        toast.error("Store is closed. You cannot add items to cart.");
        return;
      }
      const res = await fetch(`${API}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productId: String(productId), qty: 1 }),
      });
      const data = await res.json();
      if (res.ok) toast.success("Added to bag!");
      else if (data.message) toast.error(data.message);
    } finally {
      setAddingId(null);
    }
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceFilter(null);
    setSortBy("featured");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/products");
        const data = await res.json();
        if (res.ok && Array.isArray(data.products)) {
          setServerProducts(data.products as Product[]);
        }
      } catch {
        // ignore, fallback to static
      }
    };
    fetchProducts();
  }, []);

  const products = useMemo(() => {
    let result = [...serverProducts];

    if (selectedCategories.length) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    if (priceFilter) {
      result = result.filter((p) => {
        if (priceFilter === "under5") return p.price < 5000;
        if (priceFilter === "5to10") return p.price >= 5000 && p.price <= 10000;
        return p.price > 10000;
      });
    }

    if (sortBy === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result.sort((a, b) => Number(b.id) - Number(a.id));
    }

    return result;
  }, [serverProducts, selectedCategories, priceFilter, sortBy]);
  return (
    <div className="min-h-screen bg-[#fdedd6]">
      <Header />

      <main className="px-6 lg:px-20 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters on the left */}
          <aside className="w-full lg:w-72 lg:shrink-0">
            <div className="rounded-xl bg-[#f7ddbc] p-5 shadow-sm border border-[#e2c9a5]">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7b1b2b] mb-4">
                Filters
              </h2>

              <div className="space-y-5 text-sm text-gray-800">
                <div>
                  <p className="font-semibold mb-2">Category</p>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-[#7b1b2b]"
                        checked={selectedCategories.includes("Women")}
                        onChange={() => toggleCategory("Women")}
                      />
                      <span>Women</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-[#7b1b2b]"
                        checked={selectedCategories.includes("Men")}
                        onChange={() => toggleCategory("Men")}
                      />
                      <span>Men</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-[#7b1b2b]"
                        checked={selectedCategories.includes("Accessories")}
                        onChange={() => toggleCategory("Accessories")}
                      />
                      <span>Accessories</span>
                    </label>
                  </div>
                </div>

                <div>
                  <p className="font-semibold mb-2">Price</p>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="price"
                        className="accent-[#7b1b2b]"
                        checked={priceFilter === "under5"}
                        onChange={() => setPriceFilter("under5")}
                      />
                      <span>Under Rs. 5,000</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="price"
                        className="accent-[#7b1b2b]"
                        checked={priceFilter === "5to10"}
                        onChange={() => setPriceFilter("5to10")}
                      />
                      <span>Rs. 5,000 - 10,000</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="price"
                        className="accent-[#7b1b2b]"
                        checked={priceFilter === "above10"}
                        onChange={() => setPriceFilter("above10")}
                      />
                      <span>Above Rs. 10,000</span>
                    </label>
                  </div>
                </div>

                <div>
                  <p className="font-semibold mb-2">Sort by</p>
                  <select
                    className="w-full rounded-full border border-[#e2c9a5] bg-[#fdedd6] px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#7b1b2b]"
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as "featured" | "low" | "high" | "newest"
                      )
                    }
                  >
                    <option value="featured">Featured</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-full border border-[#7b1b2b] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[#7b1b2b] hover:bg-[#7b1b2b] hover:text-white transition-colors"
                >
                  CLEAR FILTERS
                </button>
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <section className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-extrabold text-[#7b1b2b] tracking-tight">
                Shop
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/productdetail/${product.id}`)}
                  className="group rounded-xl bg-[#fdedd6] shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                >
                  <div className="h-56 bg-[#e0c79f] flex items-center justify-center overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 space-y-1 bg-[#f7ddbc]">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#7b1b2b]">
                      {product.category}
                    </p>
                    <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-700">{product.price}</p>
                    <button
                      type="button"
                      onClick={() => handleAddToBag(product.id)}
                      disabled={addingId === product.id}
                      className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-[#7b1b2b] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-white hover:bg-[#5c131f] transition-colors disabled:opacity-70"
                    >
                      {addingId === product.id ? "Adding..." : "ADD TO BAG"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;