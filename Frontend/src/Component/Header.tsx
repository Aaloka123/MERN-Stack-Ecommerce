import { useEffect, useMemo, useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

type ProductSuggestion = {
  id: string | number;
  name: string;
  price?: number;
  image?: string;
  images?: string[];
};

const Header = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState<ProductSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [failedImageIds, setFailedImageIds] = useState<Set<string | number>>(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isLoggedIn =
    typeof window !== "undefined" &&
    !!sessionStorage.getItem("currentUser");

  // Fetch products for search autocomplete
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/products");
        const data = await res.json();
        if (res.ok && Array.isArray(data.products)) {
          setAllProducts(
            data.products.map((p: any) => ({
              id: p.id,
              name: p.name as string,
              price: p.price,
              image: p.image || (p.images && p.images[0]) || "",
              images: p.images,
            }))
          );
        }
      } catch {
        // ignore
      }
    };
    fetchProducts();
  }, []);

  // Check cart count if logged in
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const raw = sessionStorage.getItem("currentUser");
        if (raw) {
          const user = JSON.parse(raw);
          if (user?.email) {
            const res = await fetch(`http://localhost:5000/api/auth/cart?email=${encodeURIComponent(user.email)}`);
            const data = await res.json();
            if (res.ok && Array.isArray(data.cart)) {
              const totalQty = data.cart.reduce((sum: number, item: any) => sum + (item.qty || 1), 0);
              setCartCount(totalQty);
            }
          }
        }
      } catch {
        // ignore
      }
    };
    fetchCartCount();
  }, []);

  // Keyboard shortcut listener ('/' or 'cmd+k' / 'ctrl+k' to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) &&
          document.activeElement !== searchInputRef.current &&
          !["INPUT", "TEXTAREA"].includes((document.activeElement?.tagName || ""))) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const suggestions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return allProducts
      .filter((p) => p.name.toLowerCase().includes(term))
      .slice(0, 5);
  }, [allProducts, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchTerm.trim();
    navigate(term ? `/shop?search=${encodeURIComponent(term)}` : "/shop");
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (id: string | number, name: string) => {
    setSearchTerm(name);
    setShowSuggestions(false);
    navigate(`/productdetail/${id}`);
  };

  const navItems = useMemo(
    () => [
      { to: "/", label: "HOME", icon: "mdi:home-outline" },
      { to: "/shop", label: "SHOP", icon: "mdi:shopping-outline" },
      { to: "/new", label: "NEW ARRIVALS", icon: "mdi:sparkles" },
      { to: "/about", label: "OUR STORY", icon: "mdi:information-outline" },
    ],
    []
  );

  return (
    <header className="w-full bg-[#f6e9d6] border-b border-[#ebd7be]/80 sticky top-0 z-50 transition-all duration-300">
      {/* 1. Top Announcement Bar */}
      <div className="w-full bg-[#58101c] text-[#fbf5ee] text-[11px] sm:text-xs py-1.5 px-4 tracking-wider">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4 text-white/80">
            <span className="flex items-center gap-1">
              <Icon icon="mdi:shield-check-outline" className="text-[#dfb743]" width={14} />
              100% Authentic Luxury
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Icon icon="mdi:truck-fast-outline" className="text-[#dfb743]" width={14} />
              Complimentary Shipping &gt; Rs. 2,999
            </span>
          </div>

          <div className="mx-auto md:mx-0 flex items-center gap-2 font-medium">
            <span className="text-[#dfb743] font-bold">✨ FESTIVE '26 EDIT:</span>
            <span>Enjoy 10% Off With Code</span>
            <span className="font-bold tracking-widest text-[#dfb743] border border-[#dfb743]/50 px-1.5 py-0.5 rounded bg-black/20">
              AALOKA10
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-white/80">
            <span className="hover:text-white cursor-pointer transition-colors">Concierge</span>
            <span>•</span>
            <span className="font-semibold text-[#dfb743]">NPR (Rs.)</span>
          </div>
        </div>
      </div>

      {/* 2. Main Branding & Search Row */}
      <div className="w-full px-4 sm:px-8 lg:px-20 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <Link to="/" className="flex flex-col group text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[0.08em] text-[#7b1b2b] transition-colors duration-300 group-hover:text-[#58101c]">
                Aaloka
              </span>
              <span className="h-2 w-2 rounded-full bg-[#c59b27] mb-1 group-hover:scale-125 transition-transform"></span>
            </div>
            <span className="text-[9px] sm:text-[10px] tracking-[0.28em] text-[#7b1b2b]/75 font-semibold uppercase -mt-1">
              Atelier & Couture
            </span>
          </Link>

          {/* Center Insignia Logo */}
          <div className="flex justify-center">
            <Link
              to="/"
              aria-label="Go to home"
              className="relative p-1.5 rounded-full bg-white/70 shadow-sm border border-[#e8d5be] transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-[#7b1b2b]/30"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img
                src={logo}
                alt="Aaloka emblem"
                className="h-10 sm:h-12 w-10 sm:w-12 object-contain"
              />
            </Link>
          </div>

          {/* Right Area: Search + Quick Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Pill */}
            <div className="hidden md:block relative w-64 lg:w-72">
              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-2 shadow-sm border border-[#d8c3aa] focus-within:border-[#7b1b2b] focus-within:ring-2 focus-within:ring-[#7b1b2b]/20 focus-within:bg-white transition-all duration-300">
                  <Icon
                    icon="mdi:magnify"
                    className="text-[#7b1b2b] shrink-0"
                    width={18}
                    height={18}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search collections..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => searchTerm && setShowSuggestions(true)}
                    onBlur={() => {
                      setTimeout(() => setShowSuggestions(false), 150);
                    }}
                    className="w-full bg-transparent text-xs sm:text-sm text-[#7b1b2b] placeholder:text-[#7b1b2b]/50 focus:outline-none"
                  />
                  {searchTerm ? (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="text-gray-400 hover:text-gray-600 p-0.5"
                    >
                      <Icon icon="mdi:close-circle" width={14} />
                    </button>
                  ) : (
                    <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] text-[#7b1b2b]/60 bg-[#f7eedf] border border-[#dfcdb9] rounded font-mono shadow-2xs">
                      /
                    </kbd>
                  )}
                </div>
              </form>

              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute mt-2 w-full rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden z-50 text-xs text-gray-800">
                  <div className="px-3 py-1.5 bg-[#fbf5ee] border-b border-gray-100 text-[10px] font-semibold tracking-wider text-[#7b1b2b] uppercase">
                    Matching Pieces
                  </div>
                  <ul className="max-h-72 overflow-auto divide-y divide-gray-50">
                    {suggestions.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-[#fbf5ee] transition-colors group"
                        onMouseDown={() => handleSelectSuggestion(p.id, p.name)}
                      >
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-[#f4ebe1] overflow-hidden flex items-center justify-center border border-gray-100">
                          {p.image && !failedImageIds.has(p.id) ? (
                            <img
                              src={p.image}
                              alt=""
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                              onError={() =>
                                setFailedImageIds((prev) => new Set(prev).add(p.id))
                              }
                            />
                          ) : (
                            <Icon
                              icon="mdi:hanger"
                              className="text-gray-400"
                              width={18}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 group-hover:text-[#7b1b2b] truncate transition-colors">
                            {p.name}
                          </p>
                          {p.price && (
                            <p className="text-[11px] text-[#c59b27] font-medium">
                              Rs. {p.price.toLocaleString("en-IN")}
                            </p>
                          )}
                        </div>
                        <Icon icon="mdi:arrow-top-right" className="text-gray-300 group-hover:text-[#7b1b2b] transition-colors" width={14} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Account Link Button */}
            <Link
              to={isLoggedIn ? "/profile" : "/login"}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold tracking-wider text-[#7b1b2b] bg-white/70 border border-[#d8c3aa] hover:bg-white hover:border-[#7b1b2b]/40 hover:shadow-xs transition-all"
            >
              <Icon icon="mdi:account-outline" width={16} />
              <span>{isLoggedIn ? "PROFILE" : "ACCOUNT"}</span>
            </Link>

            {/* Shopping Bag Icon with Live Count */}
            <Link
              to="/cart"
              className="relative flex items-center justify-center h-10 w-10 rounded-full bg-[#7b1b2b] text-white shadow-md hover:bg-[#58101c] hover:scale-105 active:scale-95 transition-all"
              aria-label="View shopping bag"
            >
              <Icon icon="mdi:shopping-outline" width={19} height={19} />
              {cartCount > 0 ? (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#c59b27] px-1 text-[10px] font-bold text-white shadow-xs animate-pulse">
                  {cartCount}
                </span>
              ) : (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#dfb743]"></span>
              )}
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="md:hidden flex items-center justify-center h-10 w-10 rounded-full bg-white/80 border border-[#d8c3aa] text-[#7b1b2b] hover:bg-white transition-colors"
            >
              <Icon
                icon={mobileMenuOpen ? "mdi:close" : "mdi:menu"}
                width={22}
                height={22}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Luxury Navigation Bar */}
      <div className="w-full px-4 sm:px-8 lg:px-20 pb-3">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#7b1b2b] via-[#661623] to-[#7b1b2b] relative rounded-2xl shadow-lg border border-[#c59b27]/30 overflow-hidden">
          {/* Subtle gold top line accent */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#dfb743] to-transparent opacity-75"></div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center justify-center gap-10 py-3.5 px-6 text-[12px] font-semibold tracking-[0.2em] text-white">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative py-1 transition-all duration-300 group ${
                    isActive
                      ? "text-[#dfb743] font-bold"
                      : "text-white/90 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="transition-transform duration-300 inline-block group-hover:-translate-y-0.5">
                      {item.label}
                    </span>
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-[#dfb743] transition-all duration-300 ${
                        isActive
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Mobile Collapsible Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 px-6 py-5 flex flex-col gap-4 text-white">
              {/* Mobile Search Input */}
              <form onSubmit={handleSubmit} className="w-full">
                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2.5 border border-white/20">
                  <Icon icon="mdi:magnify" className="text-white/80" width={18} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
                  />
                </div>
              </form>

              {/* Nav Links */}
              <ul className="flex flex-col gap-2 pt-2 text-sm font-semibold tracking-wider">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                          isActive
                            ? "bg-white/20 text-[#dfb743]"
                            : "hover:bg-white/10 text-white"
                        }`
                      }
                    >
                      <Icon icon={item.icon} width={18} />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
                <li>
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/10 text-white"
                  >
                    <span className="flex items-center gap-3">
                      <Icon icon="mdi:shopping-outline" width={18} />
                      <span>SHOPPING BAG</span>
                    </span>
                    <span className="bg-[#c59b27] px-2 py-0.5 rounded-full text-xs font-bold">
                      {cartCount}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={isLoggedIn ? "/profile" : "/login"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/15 text-[#dfb743] hover:bg-white/25 mt-2"
                  >
                    <Icon icon="mdi:account-circle-outline" width={18} />
                    <span>{isLoggedIn ? "MY PROFILE & ORDERS" : "SIGN IN / REGISTER"}</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;