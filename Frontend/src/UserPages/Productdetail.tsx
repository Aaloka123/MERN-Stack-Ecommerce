import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import Suggestion from "../Component/Suggestion";
import { getJsonAuthHeaders } from "../utils/authFetch";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock?: number;
  tag?: string;
  image: string;
  images?: string[];
  description?: string;
  sizes: string[];
};

const API = "http://localhost:5000/api/auth";

const Productdetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [addToCartStatus, setAddToCartStatus] = useState<"idle" | "adding" | "done" | "login">("idle");
  const [storeClosed, setStoreClosed] = useState(false);

  useEffect(() => {
    const fetchStoreStatus = async () => {
      try {
        const res = await fetch(`${API}/store-status`);
        const data = await res.json();
        if (res.ok && typeof data.storeClosed === "boolean") {
          setStoreClosed(data.storeClosed);
        }
      } catch {
        setStoreClosed(false);
      }
    };
    fetchStoreStatus();
  }, []);

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

  const handleAddToCart = async () => {
    const email = getCurrentUserEmail();
    if (!email) {
      setAddToCartStatus("idle");
      toast.error("Please log in to add to cart.");
      return;
    }
    if (!product?.id) return;
    setAddToCartStatus("adding");
    try {
      const statusRes = await fetch(`${API}/store-status`);
      const statusData = await statusRes.json();
      if (statusData.storeClosed) {
        toast.error("Store is closed. You cannot add items to cart.");
        setAddToCartStatus("idle");
        return;
      }
      const res = await fetch(`${API}/cart/add`, {
        method: "POST",
        headers: getJsonAuthHeaders() as Record<string, string>,
        body: JSON.stringify({ email, productId: product.id, qty: 1 }),
      });
      const data = await res.json();
      if (res.ok) {
        setAddToCartStatus("done");
        toast.success("Added to bag!");
      } else {
        setAddToCartStatus("idle");
        toast.error(data.message || "Failed to add to cart");
      }
    } catch {
      setAddToCartStatus("idle");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const res = await fetch(
          `http://localhost:5000/api/auth/products/${id}`
        );
        const data = await res.json();
        if (res.ok && data.product) {
          setProduct(data.product as Product);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // auto-select the only available size, if there is exactly one
  useEffect(() => {
    if (product && product.sizes && product.sizes.length === 1) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  return (
    <div className="bg-secondaray min-h-screen flex flex-col">
      <Header />

      {/* Product detail for one product */}
      <main className="flex-1 px-4 sm:px-8 lg:px-24 py-8">
        {loading && (
          <p className="text-center text-sm text-gray-700">Loading product...</p>
        )}
        {!loading && !product && (
          <p className="text-center text-sm text-red-600">Product not found.</p>
        )}
        {product && (
          // derive image list from product.images (if present) or fallback to single image
          // capped at 4 images to match admin side
          (() => {
            const images =
              product.images && product.images.length
                ? product.images.slice(0, 4)
                : product.image
                ? [product.image]
                : [];
            const mainImage = images[activeImage] || images[0] || product.image;
            return (
          <>
            {/* Breadcrumb */}
            <nav className="mb-4 text-xs sm:text-sm text-gray-600">
              <span className="cursor-pointer hover:text-[#7b1b2b]">Home</span>
              <span className="mx-1">/</span>
              <span className="cursor-pointer hover:text-[#7b1b2b]">Shop</span>
              <span className="mx-1">/</span>
              <span className="text-[#2b1b1b] font-medium">Product</span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-2 rounded-2xl bg-transparent shadow-none border-none p-0 sm:p-0">
              {/* Left: image + thumbnails */}
              <div>
                <div className="aspect-[4/4] w-full max-w-md overflow-hidden rounded-2xl border border-[#e2c9a5] bg-secondaray mx-auto">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="mt-3 flex justify-center gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      className={`h-16 w-16 overflow-hidden rounded-xl border bg-[#fdf7f0] ${
                        activeImage === idx
                          ? "border-[#7b1b2b] ring-2 ring-[#7b1b2b]"
                          : "border-[#e2c9a5]"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${idx + 1}`}
                        className="h-full w-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: details */}
              <div className="space-y-5 text-sm text-gray-800">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                    Product detail
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
                    {product.name}
                  </h1>
                  <p className="text-sm text-gray-600">
                    Category: {product.category}
                  </p>
                  {product.description && (
                    <p className="text-sm text-gray-700 mt-1">
                      {product.description}
                    </p>
                  )}
                </div>

                <div className="flex items-baseline gap-3">
                  <p className="text-2xl font-bold text-primary">
                    Rs. {product.price.toLocaleString("en-IN")}
                  </p>
                </div>

                <p className="text-sm text-gray-600">
                  {typeof product.stock === "number" && product.stock <= 0
                    ? "Out of stock"
                    : `Stock: ${typeof product.stock === "number" ? product.stock : 0} available`}
                </p>

                {/* Size + actions */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-medium text-[#2b1b1b]">Available sizes</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => {
                        const isActive = selectedSize === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            className={`min-w-[2.5rem] rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                              isActive
                                ? "border-[#7b1b2b] bg-[#7b1b2b] text-white"
                                : "border-[#e2c9a5] bg-[#fdf7f0] text-gray-800"
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {storeClosed && (
                  <div className="rounded-xl bg-amber-100 border border-amber-300 px-4 py-3 text-sm font-medium text-amber-800">
                    Store is currently closed. Adding to cart is unavailable.
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    disabled={
                      !selectedSize ||
                      addToCartStatus === "adding" ||
                      storeClosed ||
                      (typeof product.stock === "number" && product.stock <= 0)
                    }
                    onClick={handleAddToCart}
                    className={`rounded-full px-6 py-2 text-sm font-semibold tracking-[0.16em] text-white transition-colors ${
                      selectedSize &&
                      !storeClosed &&
                      !(typeof product.stock === "number" && product.stock <= 0)
                        ? "bg-[#7b1b2b] hover:bg-[#5c131f]"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {addToCartStatus === "adding"
                      ? "Adding..."
                      : storeClosed
                      ? "STORE CLOSED"
                      : typeof product.stock === "number" && product.stock <= 0
                      ? "OUT OF STOCK"
                      : "ADD TO CART"}
                  </button>
                </div>
              </div>
            </div>

            {/* You can keep showing suggested products below */}
            <div className="mt-10">
              <Suggestion />
            </div>
          </>
            );
          })()
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Productdetail;