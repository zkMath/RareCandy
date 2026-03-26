"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-gray-600 hover:text-plum-600 transition-colors"
        aria-label="Toggle menu"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 space-y-3">
            <Link href="/gacha" onClick={() => setOpen(false)} className="block text-sm font-medium text-gray-700 hover:text-plum-600 py-2">
              Pull
            </Link>
            <Link href="/marketplace" onClick={() => setOpen(false)} className="block text-sm font-medium text-gray-700 hover:text-plum-600 py-2">
              Marketplace
            </Link>
            <Link href="/pool" onClick={() => setOpen(false)} className="block text-sm font-medium text-gray-700 hover:text-plum-600 py-2">
              Pool
            </Link>
            {isAuthenticated && (
              <Link href="/collection" onClick={() => setOpen(false)} className="block text-sm font-medium text-gray-700 hover:text-plum-600 py-2">
                Collection
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
