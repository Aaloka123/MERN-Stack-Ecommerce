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
            <img
              src={logo}
              alt="Aaloka logo"
              className="h-16 w-16 object-contain drop-shadow-sm"
            />
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
        <div className="w-full bg-[#7b1b2b] shadow-sm">
          <ul className="flex items-center justify-center gap-10 px-8 py-3 text-[11px] sm:text-xs font-semibold tracking-[0.18em] text-white">
            <li className="pb-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `cursor-pointer pb-1 ${
                    isActive ? 'border-b-2 border-white' : 'hover:border-b-2 hover:border-white'
                  }`
                }
              >
                HOME
              </NavLink>
            </li>
            <li className="pb-1">
              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `cursor-pointer pb-1 ${
                    isActive ? 'border-b-2 border-white' : 'hover:border-b-2 hover:border-white'
                  }`
                }
              >
                SHOP
              </NavLink>
            </li>
            <li className="pb-1">
              <NavLink
                to="/new"
                className={({ isActive }) =>
                  `cursor-pointer pb-1 ${
                    isActive ? 'border-b-2 border-white' : 'hover:border-b-2 hover:border-white'
                  }`
                }
              >
                NEW
              </NavLink>
            </li>
            <li className="pb-1">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `cursor-pointer pb-1 ${
                    isActive ? 'border-b-2 border-white' : 'hover:border-b-2 hover:border-white'
                  }`
                }
              >
                ABOUT
              </NavLink>
            </li>
            <li className="pb-1">
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `cursor-pointer pb-1 ${
                    isActive ? 'border-b-2 border-white' : 'hover:border-b-2 hover:border-white'
                  }`
                }
              >
                BAG
              </NavLink>
            </li>
            <li className="pb-1">
              <NavLink
                to={isLoggedIn ? "/profile" : "/login"}
                className={({ isActive }) =>
                  `cursor-pointer pb-1 ${
                    isActive
                      ? "border-b-2 border-white"
                      : "hover:border-b-2 hover:border-white"
                  }`
                }
              >
                {isLoggedIn ? "PROFILE" : "ACCOUNT"}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;