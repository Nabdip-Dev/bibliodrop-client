"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-6 py-4">

        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold"
          >
            BiblioDrop
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-6 md:flex">

            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>

            <Link
              href="/browse-books"
              className="hover:text-blue-600"
            >
              Browse Books
            </Link>

            <Link
              href="/dashboard"
              className="hover:text-blue-600"
            >
              Dashboard
            </Link>

            <Link
              href="/login"
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg border px-4 py-2"
            >
              Register
            </Link>

          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="text-2xl md:hidden"
          >
            ☰
          </button>

        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="mt-4 space-y-2 border-t pt-4 md:hidden">

            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-3 hover:bg-gray-100"
            >
              Home
            </Link>

            <Link
              href="/browse-books"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-3 hover:bg-gray-100"
            >
              Browse Books
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-3 hover:bg-gray-100"
            >
              Dashboard
            </Link>

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-3 hover:bg-gray-100"
            >
              Login
            </Link>

            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-4 py-3 hover:bg-gray-100"
            >
              Register
            </Link>

          </div>
        )}

      </div>
    </nav>
  );
}