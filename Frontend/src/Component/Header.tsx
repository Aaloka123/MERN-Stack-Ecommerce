import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState<
    { id: string | number; name: string; image?: string; images?: string[] }[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [failedImageIds, setFailedImageIds] = useState<Set<string | number>>(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn =
    typeof window !== "undefined" &&
    !!sessionStorage.getItem("currentUser");

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
      { to: "/", label: "HOME" },
      { to: "/shop", label: "SHOP" },
      { to: "/new", label: "NEW" },
      { to: "/about", label: "ABOUT" },
      { to: "/cart", label: "BAG" },
      { to: isLoggedIn ? "/profile" : "/login", label: isLoggedIn ? "PROFILE" : "ACCOUNT" },
    ],
    [isLoggedIn]
  );

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#f3e1c3]">
      {/* Top bar: brand, logo, search */}
      <div className="w-full">
        <div className="flex w-full items-center justify-between px-6 lg:px-20 pt-8 pb-6 gap-6">
          {/* Brand text */}
          <Link to="/" className="flex flex-col">
            <span className="text-3xl font-extrabold tracking-tight text-black">
              Aaloka
            </span>
          </Link>

          {/* Center logo */}
          <div className="flex justify-center flex-1">
            <Link
              to="/"
              aria-label="Go to home"
              className="flex items-center justify-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img
                src={logo}
                alt="Aaloka logo"
                className="h-16 w-16 object-contain drop-shadow-sm"
              />
            </Link>
          </div>

          {/* Search box */}
          <div className="hidden w-64 md:block relative">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 shadow-sm ring-1 ring-black/5">
                <Icon
                  icon="mdi:magnify"
                  className="text-[#7b1b2b]"
                  width={18}
                  height={18}
                />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => searchTerm && setShowSuggestions(true)}
                  onBlur={() => {
                    // Small timeout so click can register
                    setTimeout(() => setShowSuggestions(false), 120);
                  }}
                  className="w-full bg-transparent text-sm text-[#7b1b2b] placeholder:text-[#7b1b2b]/70 focus:outline-none"
                />
              </div>
            </form>
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute mt-1 w-full rounded-xl bg-white shadow-lg ring-1 ring-black/5 text-sm text-gray-800 max-h-60 overflow-auto z-20">
                {suggestions.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#f3e1c3]"
                    onMouseDown={() => handleSelectSuggestion(p.id, p.name)}
                  >
                    <div className="h-10 w-10 shrink-0 rounded-md bg-[#e6ddd0] overflow-hidden flex items-center justify-center">
                      {p.image && !failedImageIds.has(p.id) ? (
                        <img
                          src={p.image}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={() =>
                            setFailedImageIds((prev) => new Set(prev).add(p.id))
                          }
                        />
                      ) : (
                        <Icon
                          icon="mdi:image-off-outline"
                          className="text-gray-400"
                          width={20}
                          height={20}
                        />
                      )}
                    </div>
                    <span className="truncate">{p.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="w-full px-6 lg:px-20 pb-4 pt-2">
        <div className="w-full bg-[#7b1b2b] relative">
          {/* Mobile hamburger */}
          <div className="flex items-center justify-center px-6 py-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="md:hidden absolute right-6 inline-flex items-center justify-center text-white p-2 focus:outline-none focus:ring-0"
            >
              <Icon
                icon={mobileMenuOpen ? "mdi:close" : "mdi:menu"}
                width={20}
                height={20}
              />
            </button>

            {/* Desktop nav */}
            <ul className="hidden md:flex items-center justify-center gap-10 px-8 py-3 text-[11px] sm:text-xs font-semibold tracking-[0.18em] text-white">
              {navItems.map((item) => (
                <li key={item.to} className="pb-1">
                  <NavLink
                    to={item.to}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `cursor-pointer pb-1 ${
                        isActive
                          ? "border-b-2 border-white"
                          : "hover:border-b-2 hover:border-white"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <ul className="md:hidden pb-4 px-6 text-sm font-semibold tracking-[0.06em] text-white flex flex-col items-center gap-3">
              {navItems.map((item) => (
                <li key={item.to} className="w-full text-center">
                  <NavLink
                    to={item.to}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `block w-full rounded-md py-2 ${
                        isActive
                          ? "bg-white/10"
                          : "hover:bg-white/10"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;