import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header = () => {
  return (
    <header className="shadow-sm bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="E-Commerce logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-xl font-semibold tracking-tight">
            ShopEase
          </span>
        </Link>

        {/* Primary Links */}
        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            to="/"
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            Shop
          </Link>
          <Link
            to="/categories"
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            Categories
          </Link>
          <Link
            to="/deals"
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            Deals
          </Link>
        </div>

        {/* Right side: account + cart */}
        <div className="flex items-center gap-3">
          <button className="hidden rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 md:inline-flex">
            Sign in
          </button>
          <button className="relative rounded-full bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-black">
            Cart
            <span className="ml-2 rounded-full bg-white px-1.5 text-xs font-bold text-gray-900">
              0
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;