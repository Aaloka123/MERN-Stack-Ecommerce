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
            <li className="hover:text-white cursor-pointer">
              <Link to="/">Home</Link>
            </li>
            <li className="hover:text-white cursor-pointer">
              <Link to="/shop">Shop</Link>
            </li>
            <li className="hover:text-white cursor-pointer">
              <Link to="/new">New</Link>
            </li>
            <li className="hover:text-white cursor-pointer">
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>

        {/* Follow us */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">
            Follow Us
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-[#f8e1d6]">
            <li className="hover:text-white cursor-pointer">Facebook</li>
            <li className="hover:text-white cursor-pointer">Instagram</li>
            <li className="hover:text-white cursor-pointer">Twitter</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#915066]">
        <p className="py-4 text-center text-xs text-[#f8e1d6]">
          © 2026 Aaloka Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;