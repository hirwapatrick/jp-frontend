import { NavLink } from 'react-router-dom';
import { Camera, Menu, X } from 'lucide-react';
import { useState } from 'react';
import SocialLinks from './SocialLinks';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/work', label: 'Work' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full p-3 bg-white/90 dark:bg-black/90 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <NavLink to="/" className="flex items-center space-x-2">
              <img
                src="/photos/logo.png"
                alt="Jacques Photographer Logo"
                className="w-16 h-16 md:w-24 md:h-24"
              />
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm uppercase tracking-wider font-light transition-colors hover:text-gray-600 dark:hover:text-gray-300 ${
                      isActive
                        ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Social Icons - Desktop */}
            <div className="hidden md:block">
              <SocialLinks />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="md:hidden p-2 text-gray-900 dark:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden absolute top-20 left-0 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 transition-transform duration-300 ${
            isOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="flex flex-col space-y-4 p-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-base uppercase tracking-wider py-2 ${
                    isActive
                      ? 'text-gray-900 dark:text-white font-medium'
                      : 'text-gray-500 dark:text-gray-400'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <SocialLinks />
            </div>
          </div>
        </div>
      </header>

      {/* Spacer div to prevent content overlap */}
      <div className="pt-20 md:pt-24" />
    </>
  );
};

export default Navigation;