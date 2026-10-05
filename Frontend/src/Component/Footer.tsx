import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#7b1b2b] text-[#fdf4ee]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 md:flex-row md:items-start md:justify-between">
        {/* Brand + description */}
        <div className="max-w-sm">
          <h2 className="text-2xl font-extrabold tracking-wide">
            Aaloka Store
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#f8e1d6]">
            Your one-stop shop for quality products at the best.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">
            Quick Links
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-[#f8e1d6]">
            <li>
              <Link to="/" className="inline-block transition-all duration-200 hover:text-white hover:translate-x-1.5">Home</Link>
            </li>
            <li>
              <Link to="/shop" className="inline-block transition-all duration-200 hover:text-white hover:translate-x-1.5">Shop</Link>
            </li>
            <li>
              <Link to="/new" className="inline-block transition-all duration-200 hover:text-white hover:translate-x-1.5">New</Link>
            </li>
            <li>
              <Link to="/about" className="inline-block transition-all duration-200 hover:text-white hover:translate-x-1.5">About</Link>
            </li>
            <li>
              <Link to="/cart" className="inline-block transition-all duration-200 hover:text-white hover:translate-x-1.5">Bag</Link>
            </li>
          </ul>
        </div>

        {/* Follow us */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">
            Follow Us
          </h3>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#f8e1d6]">
            <span className="px-3 py-1.5 bg-white/10 rounded-full hover:bg-white/25 hover:text-white transition-all duration-200 cursor-pointer shadow-sm">Facebook</span>
            <span className="px-3 py-1.5 bg-white/10 rounded-full hover:bg-white/25 hover:text-white transition-all duration-200 cursor-pointer shadow-sm">Instagram</span>
            <span className="px-3 py-1.5 bg-white/10 rounded-full hover:bg-white/25 hover:text-white transition-all duration-200 cursor-pointer shadow-sm">Twitter</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <p className="py-4 text-center text-xs tracking-wider text-[#f8e1d6]/90">
          © 2026 Aaloka Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;