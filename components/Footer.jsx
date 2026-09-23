import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        <div className="grid gap-8 md:grid-cols-3">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold">
              BiblioDrop
            </h2>

            <p className="mt-3 max-w-sm text-gray-400">
              Your local library, delivered to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold">
              Quick Links
            </h3>

            <div className="mt-3 space-y-2">
              <Link
                href="/"
                className="block text-gray-400 hover:text-white"
              >
                Home
              </Link>

              <Link
                href="/browse-books"
                className="block text-gray-400 hover:text-white"
              >
                Browse Books
              </Link>

              <Link
                href="/dashboard"
                className="block text-gray-400 hover:text-white"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold">
              Stay Updated
            </h3>

            <p className="mt-3 text-gray-400">
              Newsletter coming soon.
            </p>

            <div className="mt-4 flex gap-3">
              <input
                type="email"
                placeholder="Your email"
                className="min-w-0 flex-1 rounded-lg px-4 py-2 text-black outline-none"
              />

              <button className="rounded-lg bg-white px-4 py-2 font-semibold text-black">
                Subscribe
              </button>
            </div>

            <div className="mt-5">
              <a
                href="#"
                className="text-gray-400 hover:text-white"
              >
                𝕏 Follow us
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          © 2026 BiblioDrop. All rights reserved.
        </div>

      </div>
    </footer>
  );
}