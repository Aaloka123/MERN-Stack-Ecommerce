import React from 'react';
import { Icon } from '@iconify/react';
import logo from '../assets/logo.png';

const Header = () => {
  return (
    <header className="w-full bg-[#f3e1c3]">
      {/* Top bar: brand, logo, search */}
      <div className="w-full">
        <div className="flex w-full items-center justify-between px-6 lg:px-20 pt-8 pb-6 gap-6">
          {/* Brand text */}
          <div className="flex flex-col">
            <span className="text-3xl font-extrabold tracking-tight text-black">
              aaloka
            </span>
            <span className="mt-1 text-sm text-black/80 tracking-wide">
              clothing store
            </span>
          </div>

          {/* Center logo */}
          <div className="flex justify-center flex-1">
            <img
              src={logo}
              alt="Aaloka logo"
              className="h-16 w-16 object-contain drop-shadow-sm"
            />
          </div>

          {/* Search box */}
          <div className="hidden w-64 md:block">
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
                className="w-full bg-transparent text-sm text-[#7b1b2b] placeholder:text-[#7b1b2b]/70 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="w-full px-6 lg:px-20 pb-4 pt-2">
        <div className="w-full bg-[#7b1b2b] shadow-sm">
          <ul className="flex items-center justify-center gap-10 px-8 py-3 text-[11px] sm:text-xs font-semibold tracking-[0.18em] text-white">
            <li className="border-b-2 border-white pb-1">
              HOME
            </li>
            <li className="pb-1 hover:border-b-2 hover:border-white cursor-pointer">
              SHOP
            </li>
            <li className="pb-1 hover:border-b-2 hover:border-white cursor-pointer">
              NEW
            </li>
            <li className="pb-1 hover:border-b-2 hover:border-white cursor-pointer">
              ABOUT
            </li>
            <li className="pb-1 hover:border-b-2 hover:border-white cursor-pointer">
              BAG
            </li>
            <li className="pb-1 hover:border-b-2 hover:border-white cursor-pointer">
              ACCOUNT
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;