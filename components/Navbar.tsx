
import React from 'react';
import { NavLink } from 'react-router-dom';
import ParticleLogo from './ParticleLogo';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-sm border-b border-gray-100 px-8 py-4 flex items-center justify-between">
      {/* Brand Identity - Now fully interactive particle text */}
      <NavLink
        to="/"
        className="flex items-center cursor-pointer flex-shrink-0 no-underline leading-none"
        style={{ textDecoration: 'none' }}
      >
        <ParticleLogo />
      </NavLink>
      
      {/* Center Navigation Links - Absolutely centered */}
      <div className="hidden md:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
        <NavLink
          to="/"
          className="text-sm font-semibold text-gray-600 hover:text-black transition-colors duration-200"
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className="text-sm font-semibold text-gray-600 hover:text-black transition-colors duration-200"
        >
          About
        </NavLink>
        <span className="text-sm font-semibold text-gray-600">
          Features
        </span>
        <NavLink
          to="/pricing"
          className="text-sm font-semibold text-gray-600 hover:text-black transition-colors duration-200"
        >
          Pricing
        </NavLink>
      </div>

      {/* Action Area - placeholder for future buttons */}
      <div className="flex items-center gap-4 flex-shrink-0">
      </div>
    </nav>
  );
};

export default Navbar;
