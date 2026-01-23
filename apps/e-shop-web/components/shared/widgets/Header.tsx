'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { HeartIcon, Search } from 'lucide-react';
import ProfileIcon from '@/public/assets/svgs/profile-icon';
import CartIcon from '@/public/assets/svgs/cart-icon';
import HeaderBottom from './HeaderBottom';
import { navItems } from '@/constants/index';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Departments dropdown state for mobile
  const [departmentsOpen, setDepartmentsOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <span className="text-2xl sm:text-3xl font-bold font-Poppins tracking-wide text-primary hover:text-blue-700 transition-colors duration-200">
                VerityStore
              </span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="relative w-full max-w-lg">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-4 pr-14 font-Poppins font-medium border border-gray-300 focus:border-primary outline-none h-12 rounded-full text-base shadow-sm transition-all duration-200"
              />
              <button className="w-12 h-12 cursor-pointer flex items-center justify-center bg-primary absolute top-0 right-0 rounded-full hover:bg-blue-700 transition-colors duration-200 shadow">
                <Search color="white" />
              </button>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-5 lg:gap-8">
            <Link
              href="/login"
              className="flex items-center gap-2 hover:text-blue-700 transition-colors duration-200"
            >
              <ProfileIcon />
              <span className="font-medium text-base">Sign In</span>
            </Link>
            <Link href="/wishlist" className="relative group">
              <HeartIcon className="group-hover:text-red-500 transition-colors duration-200" />
              <div className="w-5 h-5 border-2 bg-red-500 rounded-full flex items-center justify-center absolute -top-2 -right-2 shadow-md">
                <span className="text-white font-semibold text-xs">0</span>
              </div>
            </Link>
            <Link href="/cart" className="relative group">
              <CartIcon className="group-hover:text-green-600 transition-colors duration-200" />
              <div className="w-5 h-5 border-2 bg-red-500 rounded-full flex items-center justify-center absolute -top-2 -right-2 shadow-md">
                <span className="text-white font-semibold text-xs">0</span>
              </div>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              aria-label="Open menu"
              className="focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                width="28"
                height="28"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-xl px-4 py-4 space-y-4 border-b rounded-b-xl">
            {/* Departments Dropdown (mobile) */}
            <div>
              <button
                className="w-full flex items-center justify-between px-4 py-2 bg-primary text-white rounded-xl font-Poppins font-semibold text-base tracking-wide shadow-lg hover:bg-blue-700 transition-colors duration-200"
                onClick={() => setDepartmentsOpen(!departmentsOpen)}
              >
                <span className="flex items-center gap-3">
                  <svg
                    width="22"
                    height="22"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  All Departments
                </span>
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`transition-transform duration-200 ${departmentsOpen ? 'rotate-180' : ''}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {departmentsOpen && (
                <div className="bg-white border border-gray-200 rounded-xl mt-2 shadow animate-fade-in">
                  <ul className="space-y-2 p-2">
                    <li className="px-4 py-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200">
                      Electronics
                    </li>
                    <li className="px-4 py-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200">
                      Fashion
                    </li>
                    <li className="px-4 py-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200">
                      Home & Living
                    </li>
                    <li className="px-4 py-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200">
                      Sports
                    </li>
                    <li className="px-4 py-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors duration-200">
                      More...
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {/* Nav Links */}
            <div className="flex flex-col gap-2 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="text-base font-Poppins font-medium px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-primary transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </div>
            {/* Actions */}
            <div className="flex flex-col gap-2 mt-4">
              <Link
                href="/login"
                className="flex items-center gap-2 hover:text-blue-700 transition-colors duration-200 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ProfileIcon />
                <span className="font-medium text-base">Sign In</span>
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-2 py-2 relative group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative flex items-center">
                  <HeartIcon className="group-hover:text-red-500 transition-colors duration-200" />
                  <span className="absolute -top-2 -right-3 w-5 h-5 border-2 bg-red-500 rounded-full flex items-center justify-center z-10 shadow-md">
                    <span className="text-white font-semibold text-xs">0</span>
                  </span>
                </span>
                <span className="ml-1">Wishlist</span>
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-2 py-2 relative group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative flex items-center">
                  <CartIcon className="group-hover:text-green-600 transition-colors duration-200" />
                  <span className="absolute -top-2 -right-3 w-5 h-5 border-2 bg-red-500 rounded-full flex items-center justify-center z-10 shadow-md">
                    <span className="text-white font-semibold text-xs">0</span>
                  </span>
                </span>
                <span className="ml-1">Cart</span>
              </Link>
            </div>
            {/* Search */}
            <div className="mt-4">
              <div className="relative w-full max-w-xs mx-auto">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full pl-4 pr-12 font-Poppins font-medium border border-gray-300 focus:border-primary outline-none h-10 rounded-full text-sm shadow-sm transition-all duration-200"
                />
                <button className="w-10 h-10 cursor-pointer flex items-center justify-center bg-primary absolute top-0 right-0 rounded-full hover:bg-blue-700 transition-colors duration-200 shadow">
                  <Search color="white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      {/* Header Bottom */}
      <HeaderBottom />
    </>
  );
};

export default Header;
