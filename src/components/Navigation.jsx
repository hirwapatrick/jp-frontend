import { NavLink } from 'react-router-dom';
import { Camera, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import SocialLinks from './SocialLinks';
import logoImage from '../assets/photos/logo.png'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/work', label: 'Work' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white/95 dark:bg-black/95 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo - Fixed visibility */}
            <NavLink to="/" className="flex items-center shrink-0" onClick={() => setIsOpen(false)}>
              <img
                src={logoImage}
                alt="Jacques Photographer Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 object-contain"
                onError={(e) => {
                  console.error('Logo failed to load');
                  e.currentTarget.style.display = 'none';
                }}
              />
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 lg:space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm uppercase tracking-wider font-light transition-colors hover:text-gray-600 dark:hover:text-gray-300 py-2 ${
                      isActive
                        ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
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

            {/* Mobile Menu Button - Better visibility */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-50"
            >
              {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Improved overlay */}
        <div
          className={`md:hidden fixed top-16 sm:top-20 left-0 w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] bg-white dark:bg-black overflow-y-auto transition-transform duration-300 ease-in-out z-40 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col space-y-4 p-6 pt-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-lg uppercase tracking-wider py-3 px-4 rounded-lg transition-colors ${
                    isActive
                      ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="pt-6 mt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 px-4">Follow me</p>
              <SocialLinks />
            </div>
          </div>
        </div>
      </header>

      {/* Spacer div - Adjusted for mobile */}
      <div className="h-16 md:h-20" />
      
      {/* Overlay background when mobile menu is open */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navigation;