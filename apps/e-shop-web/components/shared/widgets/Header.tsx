'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { HeartIcon, Search } from 'lucide-react';
import ProfileIcon from '@/public/assets/svgs/profile-icon';
import CartIcon from '@/public/assets/svgs/cart-icon';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/">
            <span className="text-xl xs:text-2xl sm:text-3xl font-semibold font-Poppins">
              VerityStore
            </span>
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full pl-3 pr-12 font-Poppins font-medium border-2 border-primary outline-none h-10 sm:h-12 rounded-md text-sm sm:text-base"
            />
            <button className="w-10 h-10 sm:w-12 sm:h-12 cursor-pointer flex items-center justify-center bg-primary absolute top-0 right-0 rounded-r-md">
              <Search color="white" />
            </button>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3 sm:gap-4 lg:gap-6">
          <Link
            href="/login"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <ProfileIcon />
            <span className="font-medium text-base">Sign In</span>
          </Link>
          <Link href="/wishlist" className="relative">
            <HeartIcon />
            <div className="w-5 h-5 border-2 bg-red-500 rounded-full flex items-center justify-center absolute -top-2 -right-2">
              <span className="text-white font-medium text-xs">0</span>
            </div>
          </Link>
          <Link href="/cart" className="relative">
            <CartIcon />
            <div className="w-5 h-5 border-2 bg-red-500 rounded-full flex items-center justify-center absolute -top-2 -right-2">
              <span className="text-white font-medium text-xs">0</span>
            </div>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            aria-label="Open menu"
            className="focus:outline-none p-2"
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
        <div className="md:hidden bg-white shadow-lg px-2 py-3 space-y-3 border-b">
          <div className="flex flex-col gap-1">
            <Link
              href="/login"
              className="flex items-center gap-2 hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ProfileIcon />
              <span className="font-medium text-base">Sign In</span>
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center gap-2 py-2 relative"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="relative flex items-center">
                <HeartIcon />
                <span className="absolute -top-2 -right-3 w-5 h-5 border-2 bg-red-500 rounded-full flex items-center justify-center z-10">
                  <span className="text-white font-medium text-xs">0</span>
                </span>
              </span>
              <span className="ml-1">Wishlist</span>
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-2 py-2 relative"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="relative flex items-center">
                <CartIcon />
                <span className="absolute -top-2 -right-3 w-5 h-5 border-2 bg-red-500 rounded-full flex items-center justify-center z-10">
                  <span className="text-white font-medium text-xs">0</span>
                </span>
              </span>
              <span className="ml-1">Cart</span>
            </Link>
          </div>
          <div className="mt-2">
            <div className="relative w-full max-w-xs mx-auto">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-3 pr-10 font-Poppins font-medium border-2 border-primary outline-none h-10 rounded-md text-sm"
              />
              <button className="w-10 h-10 cursor-pointer flex items-center justify-center bg-primary absolute top-0 right-0 rounded-r-md">
                <Search color="white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
