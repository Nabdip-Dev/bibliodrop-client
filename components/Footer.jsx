
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#fcc615]/20 bg-gradient-to-br from-[#fffaf9] via-[#fffdf8] to-[#fff7dc]">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-24 top-10 h-48 w-48 rounded-full bg-[#fc1d15]/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-[#fcc615]/[0.10] blur-3xl" />

      {/* Cute book SVG */}
      <svg
        className="pointer-events-none absolute right-10 top-8 h-20 w-20 rotate-12 opacity-[0.08]"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M18 25C30 20 40 22 50 29V78C40 71 30 69 18 74V25Z"
          fill="#fc1d15"
        />
        <path
          d="M82 25C70 20 60 22 50 29V78C60 71 70 69 82 74V25Z"
          fill="#fcc615"
        />
        <path
          d="M50 29V78"
          stroke="white"
          strokeWidth="3"
        />
      </svg>

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="footer-fade">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fc1d15] shadow-lg shadow-[#fc1d15]/20">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                </svg>
              </div>

              <h2 className="text-2xl font-black tracking-tight text-gray-900">
                Biblio<span className="text-[#fc1d15]">Drop</span>
              </h2>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-600">
              Your local library, delivered to your doorstep.
              Discover books, connect with libraries, and enjoy reading.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#fcc615]/30 bg-white/70 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#10B981]" />
              Your reading journey starts here
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-fade">
            <h3 className="text-lg font-extrabold text-gray-900">
              Quick Links
            </h3>

            <div className="mt-4 space-y-2.5">
              <Link
                href="/"
                className="footer-link group flex items-center gap-2 text-sm text-gray-600"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#fc1d15] transition-all duration-300 group-hover:w-4" />
                Home
              </Link>

              <Link
                href="/browse-books"
                className="footer-link group flex items-center gap-2 text-sm text-gray-600"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#fcc615] transition-all duration-300 group-hover:w-4" />
                Browse Books
              </Link>

              <Link
                href="/dashboard"
                className="footer-link group flex items-center gap-2 text-sm text-gray-600"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6] transition-all duration-300 group-hover:w-4" />
                Dashboard
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-fade">
            <h3 className="text-lg font-extrabold text-gray-900">
              Stay Updated
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Get the latest books and library updates delivered to you.
            </p>

            <div className="mt-4 flex rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm transition-all duration-300 focus-within:border-[#fc1d15]/40 focus-within:shadow-md">
              <input
                type="email"
                placeholder="Your email"
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />

              <button className="rounded-xl bg-[#fc1d15] px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e71912] hover:shadow-lg hover:shadow-[#fc1d15]/20">
                Subscribe
              </button>
            </div>

            {/* Social */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#fc1d15]/30 hover:text-[#fc1d15]"
                aria-label="X"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.4L6.47 22H3.36l7.24-8.28L2.8 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.86h1.73L8.27 4H6.41l11.39 15.86Z" />
                </svg>
              </a>

              <span className="text-xs text-gray-500">
                Follow BiblioDrop
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-200/80 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-gray-500">
            © 2026 BiblioDrop. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Made with</span>

            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-[#fc1d15]"
              fill="currentColor"
            >
              <path d="M12 21s-7-4.35-9.5-8.2C.1 8.9 2.2 5 6.2 5c2.2 0 3.7 1.3 4.8 2.8C12.1 6.3 13.6 5 15.8 5c4 0 6.1 3.9 3.7 7.8C19 16.65 12 21 12 21Z" />
            </svg>

            <span>for book lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

