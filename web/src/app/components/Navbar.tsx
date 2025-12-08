'use client'

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Inici' },
    { href: '/serveis', label: 'Serveis' },
    { href: '/portfolio', label: 'Treballs' },
    { href: '/materials', label: 'Materials' },
    { href: '/#contacte', label: 'Contacte' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">MR</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-[var(--primary)]">Miquel A. Riudavets</h1>
              <p className="text-xs text-gray-500">Pintura i Reformes</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-[var(--primary)] font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/#contacte" className="btn-primary">
              Sol·licita Pressupost
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-[var(--primary)] font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#contacte"
                className="btn-primary text-center mx-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Sol·licita Pressupost
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
