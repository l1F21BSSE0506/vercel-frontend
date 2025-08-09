import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-elegant border-b border-neutral-200' 
        : 'bg-white/90 backdrop-blur-sm shadow-elegant'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-xl flex items-center justify-center shadow-elegant group-hover:shadow-luxury transition-all duration-300">
                <span className="text-white font-elegant font-bold text-lg lg:text-xl">T</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <span className="font-elegant font-bold text-2xl lg:text-3xl text-neutral-900 transition-colors duration-300">
              Threadswear.pk
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`relative font-medium transition-all duration-300 ${
                location.pathname === '/' 
                  ? 'text-neutral-900' 
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              Home
              {location.pathname === '/' && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-gold-500 to-gold-600 animate-glow"></span>
              )}
            </Link>
            <Link 
              to="/about" 
              className={`relative font-medium transition-all duration-300 ${
                location.pathname === '/about' 
                  ? 'text-neutral-900' 
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              About
              {location.pathname === '/about' && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-gold-500 to-gold-600 animate-glow"></span>
              )}
            </Link>
            <Link 
              to="/bargain" 
              className={`relative font-medium transition-all duration-300 ${
                location.pathname === '/bargain' 
                  ? 'text-neutral-900' 
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              Bargain
              {location.pathname === '/bargain' && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-gold-500 to-gold-600 animate-glow"></span>
              )}
            </Link>
            <Link 
              to="/waiting" 
              className={`relative font-medium transition-all duration-300 ${
                location.pathname === '/waiting' 
                  ? 'text-neutral-900' 
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              Coming Soon
              {location.pathname === '/waiting' && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-gold-500 to-gold-600 animate-glow"></span>
              )}
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'seller' && (
                  <Link 
                    to="/seller-dashboard" 
                    className="px-6 py-2.5 text-neutral-700 font-medium hover:text-neutral-900 transition-colors duration-300"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="relative group">
                  <button className="px-6 py-2.5 text-neutral-700 font-medium hover:text-neutral-900 transition-colors duration-300 flex items-center space-x-2">
                    <span>{user?.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-elegant border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <button
                      onClick={logout}
                      className="w-full px-4 py-3 text-left text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors duration-200 rounded-xl"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-6 py-2.5 text-neutral-700 font-medium hover:text-neutral-900 transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link 
                  to="/" 
                  className="px-6 py-2.5 bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-neutral-900 hover:to-neutral-800 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-elegant hover:shadow-luxury"
                >
                  Shop Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-neutral-700 hover:text-neutral-900 transition-all duration-300"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-3 border-t border-neutral-200">
            <Link 
              to="/" 
              className={`block px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                location.pathname === '/' 
                  ? 'bg-neutral-100 text-neutral-900' 
                  : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`block px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                location.pathname === '/about' 
                  ? 'bg-neutral-100 text-neutral-900' 
                  : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/bargain" 
              className={`block px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                location.pathname === '/bargain' 
                  ? 'bg-neutral-100 text-neutral-900' 
                  : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Bargain
            </Link>
            <Link 
              to="/waiting" 
              className={`block px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                location.pathname === '/waiting' 
                  ? 'bg-neutral-100 text-neutral-900' 
                  : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Coming Soon
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === 'seller' && (
                  <Link 
                    to="/seller-dashboard" 
                    className="block px-4 py-2 text-neutral-700 font-medium hover:bg-neutral-50 hover:text-neutral-900 transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block w-full px-4 py-2 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="block px-4 py-2 bg-gradient-to-r from-neutral-800 to-neutral-900 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 