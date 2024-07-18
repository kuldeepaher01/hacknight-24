// src/components/Header.jsx
'use client';
import React from 'react';
import { useContext } from 'react';
import Link from "next/link";
import { FarmContext } from '@/context/farmcontext';

const Header = () => {
  const { username } = useContext(FarmContext);
  console.log(username);
  return (
    <header className="bg-gradient-to-r from-blue-500 to-teal-500">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="block text-white" href="/">
          <span className="sr-only">Home</span>
          <svg className="h-8 text-teal-200" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Your SVG path here */}
          </svg>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            <li>
              <Link className="text-gray-200 hover:text-white" href="/about">About</Link>
            </li>
            <li>
              <Link className="text-gray-200 hover:text-white" href="/careers">Customers</Link>
            </li>
            <li>
              <Link className="text-gray-200 hover:text-white" href="/history">History</Link>
            </li>
            <li>
              <Link className="text-gray-200 hover:text-white" href="/services">Services</Link>
            </li>
            <li>
              <Link className="text-gray-200 hover:text-white" href="/blog">Blog</Link>
            </li>
          </ul>
        </nav>

        {username === 'none' &&(<div className="flex items-center gap-4">
          <div className="sm:flex sm:gap-4">
            <Link className="block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700 transition" href="/login">
              Login
            </Link>
            <Link className="hidden rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 hover:text-teal-600/75 sm:block transition" href="/register">
              Register
            </Link>
          </div>
          </div>)}

          <button className="block rounded bg-gray-100 p-2.5 text-gray-600 hover:text-gray-600/75 md:hidden">
            <span className="sr-only">Toggle menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        
      </div>
    </header>
  );
};

export default Header;
