"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          BiblioDrop
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="hover:opacity-70">
            Home
          </Link>

          <Link href="/browse-books" className="hover:opacity-70">
            Browse Books
          </Link>

          <Link href="/dashboard" className="hover:opacity-70">
            Dashboard
          </Link>

          <Link href="/login" className="hover:opacity-70">
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg px-4 py-2 text-white"
          >
            Register
          </Link>
        </nav>

      </div>
    </header>
  );
}