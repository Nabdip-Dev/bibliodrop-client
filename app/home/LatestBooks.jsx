"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";

export default function LatestBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);

        const response = await fetch("http://localhost:5000/books");

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await response.json();

        // Latest 6 books
        setBooks(data.slice(-6).reverse());
      } catch (error) {
        console.error("LATEST BOOKS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#fffaf9] via-[#faf9f6] to-[#fff8df]">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-20 top-10 h-48 w-48 rounded-full bg-[#fc1d15]/[0.06] blur-3xl" />

      <div className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-[#fcc615]/[0.10] blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fc1d15]/[0.025] blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-14">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-8 rounded-full bg-[#fc1d15]" />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#fc1d15]">
                New Collection
              </span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Latest <span className="text-[#fc1d15]">Books</span>
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Explore recently added books.
            </p>
          </div>

          <Link
            href="/browse-books"
            className="group inline-flex items-center gap-2 self-start rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#fc1d15]/30 hover:text-[#fc1d15] hover:shadow-md sm:self-auto"
          >
            View All

            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M4 10h11M11 6l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {/* Books */}
        <div className="mt-7">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm"
                >
                  <div className="h-40 animate-pulse rounded-xl bg-gray-200" />

                  <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-gray-200" />

                  <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200" />

                  <div className="mt-4 h-9 w-24 animate-pulse rounded-full bg-gray-200" />
                </div>
              ))}
            </div>
          ) : books.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <BookCard key={book._id || book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 px-6 py-12 text-center">
              <svg
                viewBox="0 0 24 24"
                className="mx-auto h-10 w-10 text-[#fc1d15]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.5 2H20v19H6.5A2.5 2.5 0 0 1 4 18.5v-14A2.5 2.5 0 0 1 6.5 2Z"
                />
              </svg>

              <p className="mt-3 text-sm font-bold text-gray-700">
                No books available
              </p>

              <p className="mt-1 text-xs text-gray-400">
                New books will appear here when added.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}