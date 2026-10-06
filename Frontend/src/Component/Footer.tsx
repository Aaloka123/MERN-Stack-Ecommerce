import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-[#58101c] text-[#fdf4ee] border-t border-[#c59b27]/30">
      {/* 1. Four Pillars of Trust Banner */}
      <div className="border-b border-white/10 bg-[#480d17] py-8 px-4 sm:px-8 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#dfb743] border border-white/15">
              <Icon icon="mdi:truck-fast-outline" width={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-wide text-white">Express Shipping</h4>
              <p className="text-xs text-[#f8e1d6]/75 mt-0.5">Complimentary over Rs. 2,999</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#dfb743] border border-white/15">
              <Icon icon="mdi:swap-horizontal-circle-outline" width={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-wide text-white">7-Day Exchanges</h4>
              <p className="text-xs text-[#f8e1d6]/75 mt-0.5">Hassle-free doorstep collection</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#dfb743] border border-white/15">
              <Icon icon="mdi:shield-check-outline" width={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-wide text-white">100% Authentic</h4>
              <p className="text-xs text-[#f8e1d6]/75 mt-0.5">Directly sourced heritage looms</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#dfb743] border border-white/15">
              <Icon icon="mdi:lock-outline" width={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-wide text-white">Encrypted Checkout</h4>
              <p className="text-xs text-[#f8e1d6]/75 mt-0.5">256-Bit SSL Secured Gateways</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Newsletter Subscription Row */}
      <div className="border-b border-white/10 py-12 px-4 sm:px-8 lg:px-20 bg-gradient-to-r from-[#58101c] via-[#6d1523] to-[#58101c]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[11px] font-bold tracking-[0.25em] text-[#dfb743] uppercase">
            Private Atelier Invitations
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1">
            Join The Aaloka Circle
          </h3>
          <p className="text-xs sm:text-sm text-[#f8e1d6]/80 mt-2 max-w-md mx-auto font-light">
            Receive 10% off your maiden curation and exclusive preview access to seasonal capsule collections.
          </p>

          {subscribed ? (
            <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#dfb743]/20 border border-[#dfb743] text-[#dfb743] text-sm font-semibold">
              <Icon icon="mdi:check-circle" width={18} />
              <span>Welcome to the Atelier. Your private coupon has been reserved.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-6 max-w-md mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full bg-white/10 border border-white/20 px-5 py-3 text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#dfb743] focus:ring-1 focus:ring-[#dfb743]"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 rounded-full bg-[#c59b27] hover:bg-[#dfb743] text-[#480d17] font-bold text-xs sm:text-sm px-6 py-3 tracking-wider transition-all duration-300 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                SUBSCRIBE
              </button>
            </form>
          )}
        </div>
      </div>

      {/* 3. Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Bio */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block group">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-3xl font-extrabold tracking-wider text-white">
                  Aaloka
                </span>
                <span className="h-2 w-2 rounded-full bg-[#dfb743]" />
              </div>
              <span className="text-[10px] tracking-[0.25em] text-[#dfb743] font-semibold uppercase block">
                Atelier & Couture
              </span>
            </Link>

            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#f8e1d6]/80 font-light max-w-sm">
              Celebrating timeless South Asian heritage with contemporary silhouettes. Thoughtfully designed and hand-finished with reverence for master artisanal traditions.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#dfb743] hover:text-[#58101c] transition-all hover:scale-110"
              >
                <Icon icon="mdi:instagram" width={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#dfb743] hover:text-[#58101c] transition-all hover:scale-110"
              >
                <Icon icon="mdi:facebook" width={18} />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#dfb743] hover:text-[#58101c] transition-all hover:scale-110"
              >
                <Icon icon="mdi:pinterest" width={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#dfb743] hover:text-[#58101c] transition-all hover:scale-110"
              >
                <Icon icon="mdi:twitter" width={18} />
              </a>
            </div>
          </div>

          {/* Quick Curations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#dfb743]">
              Curations
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-[#f8e1d6]/80 font-light">
              <li>
                <Link to="/shop?category=women" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Women's Atelier
                </Link>
              </li>
              <li>
                <Link to="/shop?category=men" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Men's Sartorial
                </Link>
              </li>
              <li>
                <Link to="/shop?category=accessories" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Heritage Accessories
                </Link>
              </li>
              <li>
                <Link to="/new" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Festive 2026 Capsule
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#dfb743]">
              Client Concierge
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-[#f8e1d6]/80 font-light">
              <li>
                <Link to="/about" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  The Atelier Story
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                  Order Tracking
                </Link>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer">
                  Bespoke Sizing Guide
                </span>
              </li>
            </ul>
          </div>

          {/* Atelier Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#dfb743]">
              Atelier Support
            </h4>
            <div className="mt-4 space-y-2 text-xs sm:text-sm text-[#f8e1d6]/80 font-light">
              <p className="flex items-start gap-2">
                <Icon icon="mdi:email-outline" width={16} className="mt-0.5 text-[#dfb743] shrink-0" />
                <span>concierge@aaloka.store</span>
              </p>
              <p className="flex items-start gap-2">
                <Icon icon="mdi:phone-outline" width={16} className="mt-0.5 text-[#dfb743] shrink-0" />
                <span>+977 1 4420000</span>
              </p>
              <p className="flex items-start gap-2">
                <Icon icon="mdi:clock-outline" width={16} className="mt-0.5 text-[#dfb743] shrink-0" />
                <span>Mon – Sat: 10:00 – 19:00</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Copyright & Payment Methods */}
      <div className="border-t border-white/10 py-6 px-4 sm:px-8 lg:px-20 bg-[#420c15]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#f8e1d6]/70">
          <p>© {new Date().getFullYear()} Aaloka Store. All rights reserved. Handcrafted with reverence.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">Shipping & Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;