'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '#profile', label: 'Profile' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#skills', label: 'Skills' },
    { href: '/blog', label: 'Blog' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <Link 
              href="/"
              className="text-cyan-400 font-bold text-xl hover:text-cyan-300 transition-colors"
            >
              <span className="font-mono">MOHIT.GERA</span>
              <span className="text-cyan-400/50 text-sm ml-2 font-mono">/security</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-3 py-2 text-cyan-400/70 hover:text-cyan-400 transition-colors group"
                >
                  <span className="relative z-10 font-mono">{item.label}</span>
                  <div className="absolute inset-0 bg-cyan-400/10 scale-0 group-hover:scale-100 transition-transform rounded" />
                  <div className="absolute left-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform" />
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              <div className="w-6 h-6 flex flex-col justify-around">
                <span className={`block h-0.5 w-6 bg-current transform transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-0.5 w-6 bg-current transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-6 bg-current transform transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ paddingTop: '4rem' }}
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <nav className="relative p-6 bg-gradient-to-b from-black/90 to-transparent">
              <div className="grid gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 text-cyan-400/70 hover:text-cyan-400 transition-colors border border-cyan-400/20 hover:border-cyan-400/50 rounded backdrop-blur-sm"
                  >
                    <span className="font-mono">{item.label}</span>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent mt-1" />
                  </Link>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,255,255,0.1),transparent_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
      </div>
    </>
  );
} 