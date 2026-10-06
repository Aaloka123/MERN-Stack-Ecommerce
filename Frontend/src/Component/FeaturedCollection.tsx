import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import Fimg1 from "../assets/Fimg1.svg";
import Fimg2 from "../assets/Fimg2.svg";
import Fimg3 from "../assets/Fimg3.svg";
import Fimg4 from "../assets/Fimg4.svg";

type Product = {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  tag?: string;
  rating?: number;
  reviews?: number;
};

// Fallback curated luxury collection if backend products are offline/loading
const fallbackFeatured: Product[] = [
  {
    id: "f1",
    name: "Embroidered Silk Kurti",
    price: 3499,
    originalPrice: 4299,
    image: Fimg1,
    tag: "BESTSELLER",
    rating: 4.9,
    reviews: 142,
  },
  {
    id: "f2",
    name: "Classic Crimson Sherwani",
    price: 8999,
    originalPrice: 10499,
    image: Fimg2,
    tag: "NEW",
    rating: 4.8,
    reviews: 86,
  },
  {
    id: "f3",
    name: "Zari Weave Anarkali Set",
    price: 6499,
    originalPrice: 7999,
    image: Fimg3,
    tag: "EXCLUSIVE",
    rating: 5.0,
    reviews: 210,
  },
  {
    id: "f4",
    name: "Contemporary Royal Bandhgala",
    price: 7299,
    originalPrice: 8599,
    image: Fimg4,
    tag: "TRENDING",
    rating: 4.9,
    reviews: 95,
  },
];

const FeaturedCollection = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Product[]>(fallbackFeatured);
  const [wishlist, setWishlist] = useState<Set<string | number>>(new Set());

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/products");
        const data = await res.json();
        if (res.ok && Array.isArray(data.products) && data.products.length > 0) {
          setItems(
            data.products.slice(0, 4).map((p: any, idx: number) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              originalPrice: Math.round(p.price * 1.2),
              image: p.image || [Fimg1, Fimg2, Fimg3, Fimg4][idx % 4],
              tag: idx % 2 === 0 ? "BESTSELLER" : "NEW",
              rating: 4.8 + (idx % 3) * 0.1,
              reviews: 45 + idx * 30,
            }))
          );
        }
      } catch {
        // keep fallbackFeatured
      }
    };
    fetchFeatured();
  }, []);

  const toggleWishlist = (e: React.MouseEvent, id: string | number) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="relative w-full bg-[#fbf5ee] px-4 sm:px-8 lg:px-20 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Ornamental Section Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="h-[1px] w-12 bg-[#c59b27]/60" />
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#c59b27] uppercase">
              Curated Masterpieces
            </span>
            <span className="h-[1px] w-12 bg-[#c59b27]/60" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#7b1b2b] tracking-tight">
            Featured Collection
          </h2>

          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="h-[1px] w-16 bg-[#e4d3bf]" />
            <span className="text-xs text-[#c59b27]">✦</span>
            <span className="h-[1px] w-16 bg-[#e4d3bf]" />
          </div>

          {/* Subtitle & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pb-2 border-b border-[#e9dcce]">
            <p className="text-xs sm:text-sm text-gray-600 font-light">
              Handpicked heritage silhouettes blending imperial grandeur with contemporary finesse.
            </p>
            <div className="flex items-center gap-2 mt-3 sm:mt-0">
              <span className="text-xs font-semibold text-[#7b1b2b]">Sort by:</span>
              <button
                type="button"
                onClick={() => navigate("/shop")}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#dfcdba] text-xs font-semibold text-[#7b1b2b] hover:bg-[#f6e9d6] transition-colors shadow-2xs cursor-pointer"
              >
                <span>Trending Now</span>
                <Icon icon="mdi:chevron-down" width={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map(({ id, image, name, price, originalPrice, tag, rating, reviews }) => {
            const isFav = wishlist.has(id);
            return (
              <div
                key={id}
                className="group relative flex flex-col rounded-2xl bg-white p-3.5 shadow-sm border border-[#ede2d4] transition-all duration-400 hover:shadow-2xl hover:border-[#c59b27]/40 hover:-translate-y-1.5"
              >
                {/* Image Container with Badges & Wishlist */}
                <div className="relative aspect-[3/3.8] w-full overflow-hidden rounded-xl bg-[#f7efe6]">
                  <Link to={`/productdetail/${id}`} className="block h-full w-full">
                    <img
                      src={image}
                      alt={name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                  </Link>

                  {/* Tag Pill */}
                  {tag && (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#7b1b2b] text-white shadow-xs">
                      {tag}
                    </span>
                  )}

                  {/* Wishlist Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleWishlist(e, id)}
                    aria-label="Add to wishlist"
                    className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 shadow-sm cursor-pointer ${
                      isFav
                        ? "bg-[#7b1b2b] text-white scale-110"
                        : "bg-white/85 text-gray-700 hover:bg-white hover:text-[#7b1b2b] hover:scale-110"
                    }`}
                  >
                    <Icon
                      icon={isFav ? "mdi:heart" : "mdi:heart-outline"}
                      width={18}
                      height={18}
                    />
                  </button>

                  {/* Quick Action Slide-up Button */}
                  <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <button
                      type="button"
                      onClick={() => navigate(`/productdetail/${id}`)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#7b1b2b]/95 hover:bg-[#58101c] text-white py-2.5 text-xs font-semibold tracking-wider shadow-lg backdrop-blur-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <Icon icon="mdi:eye-outline" width={16} />
                      <span>QUICK VIEW</span>
                    </button>
                  </div>
                </div>

                {/* Product Meta */}
                <div className="flex flex-col flex-1 pt-4 pb-1">
                  {/* Rating Stars */}
                  {rating && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="flex text-[#c59b27] text-xs">
                        {"★".repeat(Math.floor(rating))}
                      </div>
                      <span className="text-[11px] font-medium text-gray-500">
                        {rating} ({reviews})
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <Link
                    to={`/productdetail/${id}`}
                    className="font-medium text-base text-gray-900 line-clamp-1 transition-colors duration-200 hover:text-[#7b1b2b]"
                  >
                    {name}
                  </Link>

                  {/* Price Row */}
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-bold text-base text-[#7b1b2b]">
                      Rs. {price.toLocaleString("en-IN")}
                    </span>
                    {originalPrice && originalPrice > price && (
                      <span className="text-xs text-gray-400 line-through">
                        Rs. {originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col items-center justify-center mt-12">
          <Link to="/shop">
            <button className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#7b1b2b] text-white font-semibold h-13 px-10 text-sm tracking-[0.16em] uppercase shadow-lg transition-all duration-300 hover:bg-[#58101c] hover:shadow-2xl hover:gap-4 hover:scale-105 active:scale-95 cursor-pointer">
              <span>EXPLORE ALL CURATIONS</span>
              <Icon icon="mdi:arrow-right" width={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
          <span className="mt-3 text-xs text-gray-500 tracking-wider">
            Over 250+ new designs added this month
          </span>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
