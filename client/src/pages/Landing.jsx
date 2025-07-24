import React from 'react';
import { FaBars } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import Home from './Home'

function App() {
  return (

    <>
    <div className="min-h-screen flex flex-col">
      {/* Navbar - Made responsive with hamburger menu for mobile */}
      <nav className="w-full flex items-center justify-between px-4 sm:px-8 md:px-12 py-4 md:py-5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg md:text-xl tracking-tight text-green-700">Tasker</span>
        </div>
        
        {/* Mobile menu button (hidden on desktop) */}
        <button className="md:hidden p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Navigation links - hidden on mobile */}
        <ul className="hidden md:flex gap-6 lg:gap-8 text-sm md:text-[16px] text-[#4b4741] font-medium">
          <li className="hover:text-green-700 cursor-pointer">Features</li>
          <li className="hover:text-green-700 cursor-pointer">Pricing</li>
          <li className="hover:text-green-700 cursor-pointer">Company</li>
          <li className="hover:text-green-700 cursor-pointer">Integration</li>
          <li className="hover:text-green-700 cursor-pointer">Learn</li>
        </ul>
        
        {/* Auth buttons - adjusted for mobile */}
        <div className="hidden md:flex gap-3 items-center">
          <Link to={'/login'} className="rounded-full border border-[#cacaca] px-4 md:px-6 py-1.5 md:py-2 bg-white text-[#222] transition-colors hover:bg-[#f6f6f6] text-sm md:text-base cursor-pointer">
            Sign In
          </Link>
          <Link to={'/register'} className="rounded-full bg-black text-white px-4 md:px-6 py-1.5 md:py-2 font-semibold transition-colors hover:bg-[#191919] text-sm md:text-base cursor-pointer">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section - Responsive adjustments */}
      <section className="flex flex-col gap-5 md:gap-7 pt-12 md:pt-24 px-4 sm:px-8 md:px-12 max-w-[700px">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-[#191612]">
          Manage All Your <br />
          Team's <span className="relative inline-block align-middle">
            <span className="absolute inset-0 -skew-y-2 bg-green-200 z-0 w-full h-[32px] sm:h-[42px] md:h-[54px] top-2/4 -translate-y-2/4 rounded md:rounded-lg"></span>
            <span className="relative z-10 px-2 text-[#191612]">Daily Tasks</span>
          </span>
          <br />More Efficiently
        </h1>
        <p className="text-[#6e6862] text-base sm:text-lg max-w-xl">
          Start building and developing your team by starting to manage your team work system. And create a comfortable and easy collaboration atmosphere.
        </p>
        {/* <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
          <button className="rounded-full bg-[#27ca84] text-white px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold shadow hover:bg-[#118d56] transition-colors">
            Learn More
          </button>
          <button className="rounded-full border border-black bg-white px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold text-black hover:bg-[#f2eee7] transition-colors">
            Start for Free
          </button>
        </div> */}
      </section>
    </div>
    <section>
        <Home/>
    </section>
    
    </>

  );
}

export default App;