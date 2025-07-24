import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi'; // Using react-icons for menu icons
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
    <nav className="bg-white shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-green-600">TaskForges</span>
            </div>
            
            {/* Desktop Navigation - hidden on mobile */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <a href="#" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
                Home
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
                Features
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
                Pricing
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
                About
              </a>
            </div>
          </div>

          {/* Auth buttons - desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to={'/login'} className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
              Login
            </Link>
            <Link to={'/register'} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer">
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - show/hide based on menu state */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <a href="#" className="bg-green-50 border-green-500 text-green-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
            Home
          </a>
          <a href="#" className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
            Features
          </a>
          <a href="#" className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
            Pricing
          </a>
          <a href="#" className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
            About
          </a>
        </div>
        <div className="pb-3 pt-4 border-t border-gray-200">
          <div className="space-y-1 px-4">
            <Link to={'/login'} className="w-full text-left text-gray-500 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
              Sign-in
            </Link>
            <Link to={'/register'} className="w-full text-left bg-green-600 hover:bg-green-700 text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
              Sign-up
            </Link>
          </div>
        </div>
      </div>
    </nav>

    

</>

  );
}

export default Navbar;