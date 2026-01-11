"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Inici" },
    { href: "/serveis", label: "Serveis" },
    { href: "/portfolio", label: "Treballs" },
    { href: "/materials", label: "Materials" },
    { href: "/#contacte", label: "Contacte" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo-color.png"
              alt="Miquel A. Riudavets"
              width={50}
              height={84}
              className="h-14 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-base font-semibold text-gray-800">
                Miquel A. Riudavets
              </h1>
              <p className="text-xs text-gray-500">Pintura i Reformes</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-[var(--primary)] text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/#contacte" className="btn-primary text-sm">
              Sol·licita Pressupost
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-600"
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
          <div className="md:hidden pb-4 border-t border-gray-100">
            <div className="flex flex-col pt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-[var(--primary)] py-2 px-2 text-sm transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#contacte"
                className="btn-primary text-center mt-3 text-sm"
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
