'use client';

import { navItems } from '@/app/constants';
import CartIcon from '@/public/assets/svgs/cart-icon';
import ProfileIcon from '@/public/assets/svgs/profile-icon';
import { AlignLeft, ChevronDown, HeartIcon, Menu } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Track the scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`w-full transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 z-[100] bg-white shadow-2xl' : 'relative'} hidden md:block`}
    >
      <div
        className={`w-full max-w-7xl relative m-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 ${isSticky ? 'pt-4' : 'py-2'}`}
      >
        {/* All Departments Dropdown */}
        <div
          className={`w-48 sm:w-64 ${isSticky && '-mb-2'} cursor-pointer flex items-center justify-between px-4 h-[44px] sm:h-[52px] bg-primary rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-200`}
          onClick={() => setShow(!show)}
        >
          <div className="flex items-center gap-3">
            <AlignLeft color="white" />
            <span className="text-white font-Poppins font-semibold text-base tracking-wide">
              All Departments
            </span>
          </div>
          <ChevronDown
            color="white"
            className={`transition-transform duration-200 ${show ? 'rotate-180' : ''}`}
          />
        </div>

        {/* Dropdown content */}
        {show && (
          <div
            className={`absolute left-0 ${isSticky ? 'top-[60px]' : 'top-[44px]'} w-48 sm:w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-4 px-2 animate-fade-in`}
          >
            <ul className="space-y-2">
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

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2 ml-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-base font-Poppins font-medium px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-primary transition-colors duration-200"
            >
              {item.title}
            </a>
          ))}
        </div>

        {/* Desktop Actions (sticky only) */}
        <div className="hidden md:flex items-center gap-5 lg:gap-8">
          {isSticky && (
            <>
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
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center ml-2">
          <button
            aria-label="Open navigation menu"
            className="focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden bg-white shadow-xl px-4 py-4 space-y-4 border-b rounded-b-xl">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-base font-Poppins font-medium px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-primary transition-colors duration-200"
                onClick={() => setMobileNavOpen(false)}
              >
                {item.title}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-5 mt-2">
            <Link
              href="/login"
              className="flex items-center gap-2 hover:text-blue-700 transition-colors duration-200"
              onClick={() => setMobileNavOpen(false)}
            >
              <ProfileIcon />
              <span className="font-medium text-base">Sign In</span>
            </Link>
            <Link
              href="/wishlist"
              className="relative group"
              onClick={() => setMobileNavOpen(false)}
            >
              <HeartIcon className="group-hover:text-red-500 transition-colors duration-200" />
              <div className="w-5 h-5 border-2 bg-red-500 rounded-full flex items-center justify-center absolute -top-2 -right-2 shadow-md">
                <span className="text-white font-semibold text-xs">0</span>
              </div>
            </Link>
            <Link
              href="/cart"
              className="relative group"
              onClick={() => setMobileNavOpen(false)}
            >
              <CartIcon className="group-hover:text-green-600 transition-colors duration-200" />
              <div className="w-5 h-5 border-2 bg-red-500 rounded-full flex items-center justify-center absolute -top-2 -right-2 shadow-md">
                <span className="text-white font-semibold text-xs">0</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderBottom;
