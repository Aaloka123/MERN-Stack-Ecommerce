import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Icon } from "@iconify/react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

type ProductSuggestion = {
  id: string | number;
  name: string;
  price?: number;
  image?: string;
  images?: string[];
  category?: string;
};

// ── ANNOUNCEMENT PRIVILEGES DATA (CHANGE 2) ──
const ANNOUNCEMENTS = [
  {
    icon: "mdi:sparkles",
    prefix: "✨ FESTIVE '26 EDIT:",
    text: "Enjoy 10% Off Bespoke Curations With Code",
    highlight: "AALOKA10",
  },
  {
    icon: "mdi:truck-fast-outline",
    prefix: "🚚 COMPLIMENTARY SHIPPING:",
    text: "Free Express Nationwide Delivery On Orders Over",
    highlight: "Rs. 2,999",
  },
  {
    icon: "mdi:shield-check-outline",
    prefix: "🌿 ATELIER ASSURANCE:",
    text: "100% Certified Pure Silk Looms With 7-Day",
    highlight: "EXCHANGE",
  },
];

// ── CURRENCIES DATA (CHANGE 3) ──
const CURRENCIES = [
  { code: "NPR", symbol: "Rs.", label: "Nepal (NPR)" },
  { code: "INR", symbol: "₹", label: "India (INR)" },
  { code: "USD", symbol: "$", label: "USA (USD)" },
  { code: "GBP", symbol: "£", label: "UK (GBP)" },
];

// ── TRENDING SEARCH TAGS (CHANGE 6) ──
const TRENDING_TAGS = [
  "Silk Sherwani",
  "Handcrafted Zari Kurta",
  "Bridal Lehenga",
  "Mulberry Silk Saree",
  "Bespoke Bandhgala",
  "Artisan Dupatta",
];

// ── SHOP MEGA-MENU CATEGORIES (CHANGE 5) ──
const SHOP_CATEGORIES = [
  {
    title: "Women's Couture",
    path: "/shop?category=women",
    icon: "mdi:dress",
    items: [
      { name: "Pure Silk Sarees", path: "/shop?category=women&type=saree" },
      { name: "Bridal Lehengas", path: "/shop?category=women&type=lehenga" },
      { name: "Embroidered Kurtas", path: "/shop?category=women&type=kurta" },
      { name: "Handloom Dupattas", path: "/shop?category=women&type=dupatta" },
    ],
  },
  {
    title: "Men's Heritage",
    path: "/shop?category=men",
    icon: "mdi:tshirt-crew-outline",
    items: [
      { name: "Royal Sherwanis", path: "/shop?category=men&type=sherwani" },
      { name: "Imperial Bandhgalas", path: "/shop?category=men&type=bandhgala" },
      { name: "Zari Silk Kurtas", path: "/shop?category=men&type=kurta" },
      { name: "Tailored Nehru Jackets", path: "/shop?category=men&type=jacket" },
    ],
  },
  {
    title: "Seasonal Editions",
    path: "/shop?category=festive",
    icon: "mdi:crown-outline",
    items: [
      { name: "Festive Royale '26", path: "/shop?category=festive" },
      { name: "Handcrafted Zari Edit", path: "/shop?search=zari" },
      { name: "Maiden Silk Arrivals", path: "/new" },
      { name: "Exclusive Capsule Pieces", path: "/shop?category=limited" },
    ],
  },
];

const Header = () => {
  const navigate = useNavigate();

  // ── States ──
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState<ProductSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [failedImageIds, setFailedImageIds] = useState<Set<string | number>>(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(2);

  // CHANGE 1: Sticky Scroll State
  const [isScrolled, setIsScrolled] = useState(false);

  // CHANGE 2: Rotating Announcement Index
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  // CHANGE 3: Currency Switcher State & Popover
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  // CHANGE 4: Concierge VIP Consultation Modal
  const [conciergeOpen, setConciergeOpen] = useState(false);

  // CHANGE 5: Shop Mega-Menu Dropdown State
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  // CHANGE 8: Cart Mini-Preview Popover
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);

  // CHANGE 9: Account Dropdown Popover
  const [accountOpen, setAccountOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const megaMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auth Status & User Info
  const currentUserRaw = typeof window !== "undefined" ? sessionStorage.getItem("currentUser") : null;
  const currentUser = useMemo(() => {
    if (!currentUserRaw) return null;
    try {
      return JSON.parse(currentUserRaw);
    } catch {
      return null;
    }
  }, [currentUserRaw]);
  const isLoggedIn = !!currentUser;

  // ── CHANGE 1: Scroll Listener for Sticky Blur Navbar ──
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── CHANGE 2: Auto-Rotating Top Announcement Privileges ──
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // ── CHANGE 10: Global Escape Key to Close All Active Popovers & Modals ──
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCurrencyOpen(false);
        setConciergeOpen(false);
        setMegaMenuOpen(false);
        setCartPreviewOpen(false);
        setAccountOpen(false);
        setShowSuggestions(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, []);

  // Keyboard shortcut listener ('/' or 'cmd+k' / 'ctrl+k' to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) &&
        document.activeElement !== searchInputRef.current &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "")
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setShowSuggestions(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
              category: p.category,
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
        if (currentUser?.email) {
          const res = await fetch(`http://localhost:5000/api/auth/cart?email=${encodeURIComponent(currentUser.email)}`);
          const data = await res.json();
          if (res.ok && Array.isArray(data.cart)) {
            const totalQty = data.cart.reduce((sum: number, item: any) => sum + (item.qty || 1), 0);
            setCartCount(totalQty);
          }
        }
      } catch {
        // ignore
      }
    };
    fetchCartCount();
  }, [currentUser]);

  // Wishlist count initialization
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aaloka_wishlist");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setWishlistCount(parsed.length);
      }
    } catch {
      // ignore
    }
  }, []);

  const suggestions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return allProducts.filter((p) => p.name.toLowerCase().includes(term)).slice(0, 5);
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

  const handleSignOut = () => {
    sessionStorage.removeItem("currentUser");
    setAccountOpen(false);
    navigate("/login");
    window.location.reload();
  };

  const handleMegaMenuEnter = useCallback(() => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setMegaMenuOpen(true);
  }, []);

  const handleMegaMenuLeave = useCallback(() => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 220);
  }, []);

  const currentAnnouncement = ANNOUNCEMENTS[announcementIdx];

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#f6e9d6]/95 backdrop-blur-md shadow-md border-b border-[#ebd7be]"
          : "bg-[#f6e9d6] border-b border-[#ebd7be]/80"
      }`}
    >
      {/* ── 1. TOP ANNOUNCEMENT BAR (ROTATING & INTERACTIVE CONTROLS) ── */}
      <div className="w-full bg-[#58101c] text-[#fbf5ee] text-[11px] sm:text-xs py-1.5 px-4 tracking-wider transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Assurance Badges */}
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

          {/* Center: CHANGE 2 - Rotating Announcement Micro Ticker */}
          <div className="mx-auto md:mx-0 flex items-center gap-2 font-medium transition-all duration-500">
            <Icon icon={currentAnnouncement.icon} className="text-[#dfb743] shrink-0" width={14} />
            <span className="text-[#dfb743] font-bold">{currentAnnouncement.prefix}</span>
            <span className="hidden sm:inline">{currentAnnouncement.text}</span>
            <span className="font-bold tracking-widest text-[#dfb743] border border-[#dfb743]/50 px-1.5 py-0.2 rounded bg-black/25">
              {currentAnnouncement.highlight}
            </span>
          </div>

          {/* Right: CHANGE 3 & 4 - VIP Concierge & Region Switcher */}
          <div className="hidden lg:flex items-center gap-4 text-white/85">
            <button
              type="button"
              onClick={() => setConciergeOpen(true)}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[11px] uppercase tracking-wider"
            >
              <Icon icon="mdi:headset" className="text-[#dfb743]" width={13} />
              <span>Concierge</span>
            </button>
            <span>•</span>

            {/* Currency Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center gap-1 font-semibold text-[#dfb743] hover:text-white transition-colors cursor-pointer"
                aria-haspopup="listbox"
                aria-expanded={currencyOpen}
              >
                <span>{currency.code} ({currency.symbol})</span>
                <Icon icon="mdi:chevron-down" width={13} />
              </button>

              {currencyOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white shadow-xl border border-gray-100 py-1.5 z-50 text-xs text-gray-800 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-gray-400 border-b border-gray-100">
                    Select Currency
                  </div>
                  {CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => {
                        setCurrency(curr);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#fbf5ee] transition-colors ${
                        currency.code === curr.code ? "text-[#7b1b2b] font-bold bg-[#fbf5ee]/70" : ""
                      }`}
                    >
                      <span>{curr.label}</span>
                      <span className="text-[#c59b27] font-semibold">{curr.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. MAIN BRANDING & SEARCH ROW ── */}
      <div className={`w-full px-4 sm:px-8 lg:px-20 transition-all duration-300 ${isScrolled ? "py-2.5" : "py-4"}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <Link to="/" className="flex flex-col group text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[0.08em] text-[#7b1b2b] transition-colors duration-300 group-hover:text-[#58101c]">
                Aaloka
              </span>
              <span className="h-2 w-2 rounded-full bg-[#c59b27] mb-1 group-hover:scale-125 transition-transform" />
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
                className={`object-contain transition-all duration-300 ${
                  isScrolled ? "h-9 w-9 sm:h-10 sm:w-10" : "h-10 sm:h-12 w-10 sm:w-12"
                }`}
              />
            </Link>
          </div>

          {/* Right Area: Search + Wishlist + Cart + Account */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* ── CHANGE 6: ENHANCED SEARCH PILL WITH TRENDING TAGS ── */}
            <div className="hidden md:block relative w-64 lg:w-72">
              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-2 shadow-xs border border-[#d8c3aa] focus-within:border-[#7b1b2b] focus-within:ring-2 focus-within:ring-[#7b1b2b]/20 focus-within:bg-white transition-all duration-300">
                  <Icon icon="mdi:magnify" className="text-[#7b1b2b] shrink-0" width={18} height={18} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search collections..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full bg-transparent text-xs sm:text-sm text-[#7b1b2b] placeholder:text-[#7b1b2b]/50 focus:outline-none"
                  />
                  {searchTerm ? (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
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

              {/* Search Suggestions & Trending Dropdown */}
              {showSuggestions && (
                <div className="absolute mt-2 w-80 -left-6 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden z-50 text-xs text-gray-800 animate-in fade-in duration-150">
                  {suggestions.length > 0 ? (
                    <>
                      <div className="px-3.5 py-2 bg-[#fbf5ee] border-b border-gray-100 text-[10px] font-bold tracking-wider text-[#7b1b2b] uppercase">
                        Matching Pieces ({suggestions.length})
                      </div>
                      <ul className="max-h-64 overflow-auto divide-y divide-gray-50">
                        {suggestions.map((p) => (
                          <li
                            key={p.id}
                            className="flex items-center gap-3 px-3.5 py-2.5 cursor-pointer hover:bg-[#fbf5ee] transition-colors group"
                            onMouseDown={() => handleSelectSuggestion(p.id, p.name)}
                          >
                            <div className="h-10 w-10 shrink-0 rounded-lg bg-[#f4ebe1] overflow-hidden flex items-center justify-center border border-gray-100">
                              {p.image && !failedImageIds.has(p.id) ? (
                                <img
                                  src={p.image}
                                  alt=""
                                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                                  onError={() => setFailedImageIds((prev) => new Set(prev).add(p.id))}
                                />
                              ) : (
                                <Icon icon="mdi:hanger" className="text-gray-400" width={18} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 group-hover:text-[#7b1b2b] truncate transition-colors">
                                {p.name}
                              </p>
                              {p.price && (
                                <p className="text-[11px] text-[#c59b27] font-bold">
                                  Rs. {p.price.toLocaleString("en-IN")}
                                </p>
                              )}
                            </div>
                            <Icon
                              icon="mdi:arrow-top-right"
                              className="text-gray-300 group-hover:text-[#7b1b2b] transition-colors"
                              width={14}
                            />
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <div className="p-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-[#7b1b2b] uppercase mb-2">
                        <Icon icon="mdi:trending-up" width={14} className="text-[#c59b27]" />
                        <span>Trending Atelier Inquiries</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {TRENDING_TAGS.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onMouseDown={() => {
                              setSearchTerm(tag);
                              setShowSuggestions(false);
                              navigate(`/shop?search=${encodeURIComponent(tag)}`);
                            }}
                            className="px-2.5 py-1 rounded-full bg-[#fbf5ee] hover:bg-[#7b1b2b] text-[#7b1b2b] hover:text-white border border-[#c59b27]/30 text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── CHANGE 7: WISHLIST QUICK-ACCESS ICON ── */}
            <Link
              to="/shop?filter=wishlist"
              className="relative hidden sm:flex items-center justify-center h-10 w-10 rounded-full bg-white/70 border border-[#d8c3aa] text-[#7b1b2b] hover:bg-white hover:border-[#7b1b2b]/40 hover:scale-105 active:scale-95 transition-all"
              aria-label="View saved pieces"
              title="Saved in Wishlist"
            >
              <Icon icon="mdi:heart-outline" width={18} height={18} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#7b1b2b] px-1 text-[9px] font-bold text-white shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* ── CHANGE 9: SMART USER ACCOUNT DROPDOWN ── */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen(!accountOpen)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold tracking-wider text-[#7b1b2b] bg-white/70 border border-[#d8c3aa] hover:bg-white hover:border-[#7b1b2b]/40 hover:shadow-xs transition-all cursor-pointer"
                aria-haspopup="menu"
                aria-expanded={accountOpen}
              >
                <Icon icon="mdi:account-outline" width={16} />
                <span>{isLoggedIn ? (currentUser.name ? currentUser.name.split(" ")[0].toUpperCase() : "PROFILE") : "ACCOUNT"}</span>
                <Icon icon="mdi:chevron-down" width={13} />
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-gray-100 py-2 z-50 text-xs text-gray-800 animate-in fade-in duration-150">
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-bold text-[#7b1b2b] truncate">{currentUser.name || "Atelier Patron"}</p>
                        <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#fbf5ee] text-gray-700 hover:text-[#7b1b2b] transition-colors"
                        >
                          <Icon icon="mdi:account-circle-outline" width={16} />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/myorders"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#fbf5ee] text-gray-700 hover:text-[#7b1b2b] transition-colors"
                        >
                          <Icon icon="mdi:package-variant-closed" width={16} />
                          <span>My Orders & Couture</span>
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-red-50 text-red-700 transition-colors cursor-pointer text-left font-medium"
                        >
                          <Icon icon="mdi:logout" width={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3">
                      <p className="text-[11px] text-gray-500 mb-2">Welcome to Aaloka Atelier</p>
                      <Link
                        to="/login"
                        onClick={() => setAccountOpen(false)}
                        className="w-full block text-center py-2 rounded-xl bg-[#7b1b2b] hover:bg-[#58101c] text-white font-bold tracking-wider mb-2 transition-colors"
                      >
                        SIGN IN
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setAccountOpen(false)}
                        className="w-full block text-center py-1.5 rounded-xl border border-[#d8c3aa] hover:bg-[#fbf5ee] text-[#7b1b2b] font-semibold tracking-wider transition-colors"
                      >
                        REGISTER ATELIER
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── CHANGE 8: SHOPPING BAG WITH MINI-PREVIEW HOVER ── */}
            <div
              className="relative"
              onMouseEnter={() => setCartPreviewOpen(true)}
              onMouseLeave={() => setCartPreviewOpen(false)}
            >
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
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#dfb743]" />
                )}
              </Link>

              {/* Shopping Bag Mini Flyout */}
              {cartPreviewOpen && (
                <div className="hidden sm:block absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-gray-100 p-4 z-50 text-xs text-gray-800 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="font-bold text-[#7b1b2b] uppercase tracking-wider text-[11px]">
                      Your Shopping Bag
                    </span>
                    <span className="text-gray-500 font-semibold">{cartCount} {cartCount === 1 ? "Item" : "Items"}</span>
                  </div>
                  <div className="py-3">
                    {cartCount > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-[#fbf5ee] border border-[#ebd7be]">
                          <Icon icon="mdi:truck-check-outline" className="text-[#c59b27]" width={18} />
                          <span className="text-[11px] text-gray-700">Eligible for Free Express Shipping!</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-center text-gray-400 py-3 italic">Your bag is currently empty</p>
                    )}
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-gray-100">
                    <Link
                      to="/cart"
                      className="w-full block text-center py-2 rounded-xl bg-[#7b1b2b] hover:bg-[#58101c] text-white font-bold tracking-wider transition-colors"
                    >
                      VIEW BAG & CHECKOUT
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="md:hidden flex items-center justify-center h-10 w-10 rounded-full bg-white/80 border border-[#d8c3aa] text-[#7b1b2b] hover:bg-white transition-colors cursor-pointer"
            >
              <Icon icon={mobileMenuOpen ? "mdi:close" : "mdi:menu"} width={22} height={22} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. LUXURY NAVIGATION BAR (DESKTOP & MOBILE WITH MEGA-MENU) ── */}
      <div className="w-full px-4 sm:px-8 lg:px-20 pb-3">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#7b1b2b] via-[#661623] to-[#7b1b2b] relative rounded-2xl shadow-lg border border-[#c59b27]/30">
          {/* Gold top accent line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#dfb743] to-transparent opacity-75" />

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center justify-center gap-10 py-3.5 px-6 text-[12px] font-semibold tracking-[0.2em] text-white">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative py-1 transition-all duration-300 group ${isActive ? "text-[#dfb743] font-bold" : "text-white/90 hover:text-white"}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="transition-transform duration-300 inline-block group-hover:-translate-y-0.5">
                    HOME
                  </span>
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-[#dfb743] transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                </>
              )}
            </NavLink>

            {/* ── CHANGE 5: SHOP WITH HOVER MEGA-MENU ── */}
            <div
              className="relative"
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
            >
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `relative py-1 inline-flex items-center gap-1 transition-all duration-300 group ${
                    isActive ? "text-[#dfb743] font-bold" : "text-white/90 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="transition-transform duration-300 inline-block group-hover:-translate-y-0.5">
                      SHOP
                    </span>
                    <Icon icon="mdi:chevron-down" width={14} className="opacity-70 group-hover:opacity-100" />
                    <span className={`absolute bottom-0 left-0 h-[2px] bg-[#dfb743] transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                  </>
                )}
              </NavLink>

              {/* Flyout Mega-Menu Dropdown */}
              {megaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[620px] z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="bg-[#480d17] border border-[#dfb743]/50 rounded-2xl p-6 shadow-2xl text-white backdrop-blur-md">
                    <div className="grid grid-cols-3 gap-6">
                      {SHOP_CATEGORIES.map((cat) => (
                        <div key={cat.title} className="space-y-3">
                          <Link
                            to={cat.path}
                            onClick={() => setMegaMenuOpen(false)}
                            className="flex items-center gap-2 text-xs font-bold text-[#dfb743] uppercase tracking-wider hover:underline"
                          >
                            <Icon icon={cat.icon} width={16} />
                            <span>{cat.title}</span>
                          </Link>
                          <ul className="space-y-2 text-[11px] text-[#f8e1d6]/80 font-normal">
                            {cat.items.map((item) => (
                              <li key={item.name}>
                                <Link
                                  to={item.path}
                                  onClick={() => setMegaMenuOpen(false)}
                                  className="hover:text-white transition-colors block py-0.5"
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#dfb743]">
                      <span>✦ Free tailored sizing consultations with every ensemble</span>
                      <Link
                        to="/shop"
                        onClick={() => setMegaMenuOpen(false)}
                        className="font-bold underline hover:text-white"
                      >
                        View Full Atelier Catalog &gt;
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/new"
              className={({ isActive }) =>
                `relative py-1 transition-all duration-300 group ${isActive ? "text-[#dfb743] font-bold" : "text-white/90 hover:text-white"}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="transition-transform duration-300 inline-block group-hover:-translate-y-0.5">
                    NEW ARRIVALS
                  </span>
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-[#dfb743] transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                </>
              )}
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `relative py-1 transition-all duration-300 group ${isActive ? "text-[#dfb743] font-bold" : "text-white/90 hover:text-white"}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="transition-transform duration-300 inline-block group-hover:-translate-y-0.5">
                    OUR STORY
                  </span>
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-[#dfb743] transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                </>
              )}
            </NavLink>
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
                <li>
                  <NavLink
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                        isActive ? "bg-white/20 text-[#dfb743]" : "hover:bg-white/10 text-white"
                      }`
                    }
                  >
                    <Icon icon="mdi:home-outline" width={18} />
                    <span>HOME</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                        isActive ? "bg-white/20 text-[#dfb743]" : "hover:bg-white/10 text-white"
                      }`
                    }
                  >
                    <Icon icon="mdi:shopping-outline" width={18} />
                    <span>SHOP ALL</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/new"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                        isActive ? "bg-white/20 text-[#dfb743]" : "hover:bg-white/10 text-white"
                      }`
                    }
                  >
                    <Icon icon="mdi:sparkles" width={18} />
                    <span>NEW ARRIVALS</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                        isActive ? "bg-white/20 text-[#dfb743]" : "hover:bg-white/10 text-white"
                      }`
                    }
                  >
                    <Icon icon="mdi:information-outline" width={18} />
                    <span>OUR STORY</span>
                  </NavLink>
                </li>

                {/* Mobile Concierge Trigger */}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setConciergeOpen(true);
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/10 text-[#dfb743] cursor-pointer"
                  >
                    <Icon icon="mdi:headset" width={18} />
                    <span>VIP CONCIERGE & STYLIST</span>
                  </button>
                </li>

                {/* Mobile Bag Link */}
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

                {/* Mobile Account Link */}
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

      {/* ── CHANGE 4: ATELIER VIP CONCIERGE MODAL ── */}
      {conciergeOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="concierge-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setConciergeOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-[#480d17] border border-[#dfb743]/50 rounded-3xl p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setConciergeOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Close concierge dialog"
            >
              <Icon icon="mdi:close" width={18} />
            </button>

            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#dfb743]/20 border border-[#dfb743] text-[#dfb743] mb-3">
                <Icon icon="mdi:headset" width={26} />
              </div>
              <h3 id="concierge-modal-title" className="font-serif text-2xl font-bold text-white">
                Atelier Concierge
              </h3>
              <p className="text-xs text-[#f8e1d6]/80 mt-1 max-w-xs mx-auto">
                Dedicated personal styling, sizing bespoke assistance, and private boutique showings.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <a
                href="https://wa.me/9779800000000?text=Hello%20Aaloka%20Concierge,%20I%20would%20like%20assistance%20with%20custom%20styling."
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-xs font-semibold"
              >
                <Icon icon="mdi:whatsapp" width={22} className="text-[#25D366]" />
                <div className="flex-1">
                  <p className="text-white">Direct WhatsApp Stylist</p>
                  <p className="text-[10px] text-gray-300 font-normal">Typical reply time: Under 5 mins</p>
                </div>
                <Icon icon="mdi:chevron-right" width={18} className="text-gray-400" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setConciergeOpen(false);
                  navigate("/about");
                }}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-xs font-semibold cursor-pointer text-left"
              >
                <Icon icon="mdi:calendar-clock" width={22} className="text-[#dfb743]" />
                <div className="flex-1">
                  <p className="text-white">Book Bridal Consultation</p>
                  <p className="text-[10px] text-gray-300 font-normal">In-person & video bespoke sessions</p>
                </div>
                <Icon icon="mdi:chevron-right" width={18} className="text-gray-400" />
              </button>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center text-[11px] text-[#f8e1d6]/70">
                <span>Direct Atelier Phone: </span>
                <span className="text-[#dfb743] font-bold">+977 1 4500000 / +977 9801234567</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;