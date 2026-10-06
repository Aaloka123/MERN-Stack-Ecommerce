import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import Timg1 from "../assets/Timg1.svg";
import Timg2 from "../assets/Timg2.svg";
import Timg3 from "../assets/Timg3.svg";
import Timg4 from "../assets/Timg4.svg";

type Product = {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  rating?: number;
  reviews?: number;
};

const fallbackTopPicks: Product[] = [
  {
    id: "t1",
    name: "Royal Velvet Achkan Jacket",
    price: 9499,
    originalPrice: 11999,
    image: Timg1,
    category: "Bestsellers",
    rating: 5.0,
    reviews: 178,
  },
  {
    id: "t2",
    name: "Hand-Block Chanderi Saree",
    price: 5299,
    originalPrice: 6299,
    image: Timg2,
    category: "Evening Wear",
    rating: 4.9,
    reviews: 92,
  },
  {
    id: "t3",
    name: "Embellished Nehru Waistcoat",
    price: 4199,
    originalPrice: 4999,
    image: Timg3,
    category: "Casual Luxury",
    rating: 4.8,
    reviews: 64,
  },
  {
    id: "t4",
    name: "Pastel Organza Dupatta Suit",
    price: 6899,
    originalPrice: 7999,
    image: Timg4,
    category: "Bestsellers",
    rating: 4.9,
    reviews: 115,
  },
];

const categories = ["All", "Bestsellers", "Evening Wear", "Casual Luxury"];

const Toppicks = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems] = useState<Product[]>(fallbackTopPicks);
  const [wishlist, setWishlist] = useState<Set<string | number>>(new Set());

  useEffect(() => {
    const fetchTopPicks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/products");
        const data = await res.json();
        if (res.ok && Array.isArray(data.products) && data.products.length > 0) {
          setToppickProducts(data.products);
        }
      } catch {
        // keep fallbackTopPicks
      }
    };

    const setToppickProducts = (products: any[]) => {
      setItems(
        products.slice(0, 4).map((p: any, idx: number) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: Math.round(p.price * 1.18),
          image: p.image || [Timg1, Timg2, Timg3, Timg4][idx % 4],
          category: categories[(idx % (categories.length - 1)) + 1],
          rating: 4.8 + (idx % 3) * 0.1,
          reviews: 50 + idx * 24,
        }))
      );
    };

    fetchTopPicks();
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

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory || !item.category);

  return (
    <section className="relative w-full bg-[#f6e9d6] px-4 sm:px-8 lg:px-20 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c59b27]" />
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#c59b27] uppercase">
              Trending This Season
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#c59b27]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#7b1b2b] tracking-tight">
            Top Picks & Editor's Choice
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-gray-600 max-w-lg mx-auto font-light">
            Loved by style connoisseurs. Pieces celebrated for impeccable drape, fit, and elegance.
          </p>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-7">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 shadow-2xs cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#7b1b2b] text-white shadow-md scale-105"
                    : "bg-white/80 text-gray-700 hover:bg-white hover:text-[#7b1b2b]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {filteredItems.map(({ id, image, name, price, originalPrice, rating, reviews }) => {
            const isFav = wishlist.has(id);
            return (
              <div
                key={id}
                className="group relative flex flex-col rounded-2xl bg-white p-3.5 shadow-sm border border-[#e8d7c5] transition-all duration-400 hover:shadow-2xl hover:border-[#c59b27]/40 hover:-translate-y-1.5"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-[3/3.8] w-full overflow-hidden rounded-xl bg-[#fdfaf6]">
                  <Link to={`/productdetail/${id}`} className="block h-full w-full">
                    <img
                      src={image}
                      alt={name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                  </Link>

                  {/* Top Pick Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#c59b27] text-white shadow-xs">
                    TOP CHOICE
                  </span>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleWishlist(e, id)}
                    aria-label="Wishlist toggle"
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

                  {/* Quick View Button */}
                  <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <button
                      type="button"
                      onClick={() => navigate(`/productdetail/${id}`)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#7b1b2b]/95 hover:bg-[#58101c] text-white py-2.5 text-xs font-semibold tracking-wider shadow-lg backdrop-blur-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <Icon icon="mdi:bag-personal-outline" width={16} />
                      <span>SELECT OPTIONS</span>
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col flex-1 pt-4 pb-1">
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

                  <Link
                    to={`/productdetail/${id}`}
                    className="font-medium text-base text-gray-900 line-clamp-1 transition-colors duration-200 hover:text-[#7b1b2b]"
                  >
                    {name}
                  </Link>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-bold text-base text-[#7b1b2b]">
                      Rs. {price.toLocaleString("en-IN")}
                    </span>
                    {originalPrice && (
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
        <div className="flex justify-center mt-12">
          <Link to="/shop">
            <button className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#7b1b2b] text-white font-semibold h-13 px-10 text-sm tracking-[0.16em] uppercase shadow-lg transition-all duration-300 hover:bg-[#58101c] hover:shadow-2xl hover:gap-4 hover:scale-105 active:scale-95 cursor-pointer">
              <span>EXPLORE ALL TOP PICKS</span>
              <Icon icon="mdi:arrow-right" width={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Toppicks;
