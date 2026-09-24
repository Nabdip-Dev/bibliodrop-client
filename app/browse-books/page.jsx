"use client";

import { useEffect, useMemo, useState } from "react";
import BookCard from "@/components/BookCard";

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch books from backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/books");

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await response.json();
        setBooks(data);
      } catch (err) {
        console.error("BOOK FETCH ERROR:", err);
        setError("Failed to load books. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        books.map((book) => book.category).filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [books]);

  // Search, filter and sort
  const filteredBooks = useMemo(() => {
    let result = books.filter((book) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        book.title?.toLowerCase().includes(searchValue) ||
        book.author?.toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "All" || book.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "title-asc") {
      result = [...result].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    if (sort === "fee-low") {
      result = [...result].sort(
        (a, b) => a.deliveryFee - b.deliveryFee
      );
    }

    if (sort === "fee-high") {
      result = [...result].sort(
        (a, b) => b.deliveryFee - a.deliveryFee
      );
    }

    return result;
  }, [books, search, category, sort]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#fffaf9] via-[#fffdf8] to-[#fff7dc] px-3 py-6 sm:px-5">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-20 top-16 h-40 w-40 animate-[browseFloat_7s_ease-in-out_infinite] rounded-full bg-[#fc1d15]/[0.055] blur-3xl" />

      <div className="pointer-events-none absolute -right-20 top-60 h-44 w-44 animate-[browseFloatReverse_9s_ease-in-out_infinite] rounded-full bg-[#fcc615]/[0.10] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* Header */}
        <div className="animate-[browseFadeDown_0.6s_ease-out_both] text-center">

          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-2.5 py-1 shadow-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#fc1d15]" />

            <span className="text-[8px] font-black uppercase tracking-[0.15em] text-black/55">
              Explore Collection
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
            Browse{" "}
            <span className="text-[#fc1d15]">
              Books
            </span>
          </h1>

          <p className="mx-auto mt-1.5 max-w-md text-[11px] font-medium leading-5 text-black/50">
            Discover your next favorite book from local
            libraries and explore a world of stories.
          </p>

          <div className="mx-auto mt-3 flex items-center justify-center gap-1.5">
            <div className="h-0.5 w-7 rounded-full bg-[#fc1d15]" />
            <div className="h-1 w-1 rounded-full bg-[#fcc615]" />
            <div className="h-0.5 w-10 rounded-full bg-black/10" />
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 animate-[browseFadeUp_0.6s_0.1s_ease-out_both] rounded-2xl border border-black/10 bg-white/85 p-3 shadow-[0_8px_25px_rgba(0,0,0,0.05)] backdrop-blur-md">

          <div className="mb-2 flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#fff0ed]">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 text-[#fc1d15]"
                fill="none"
              >
                <path
                  d="M4 6h16M7 12h10M10 18h4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <span className="text-[10px] font-black text-black">
              Find Your Book
            </span>
          </div>

          <div className="grid gap-2 md:grid-cols-3">

            {/* Search */}
            <div className="relative group">
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/30 transition-colors group-focus-within:text-[#fc1d15]"
                fill="none"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="m16 16 4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <input
                type="text"
                placeholder="Search by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border-2 border-black/10 bg-[#fffdf8] py-2 pl-8 pr-3 text-[10px] font-semibold text-black outline-none transition-all duration-300 placeholder:text-black/30 hover:border-black/20 focus:border-black focus:bg-white focus:shadow-[2px_2px_0_#fcc615]"
              />
            </div>

            {/* Category */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-lg border-2 border-black/10 bg-[#fffdf8] px-3 py-2 text-[10px] font-bold text-black outline-none transition-all duration-300 hover:border-black/20 focus:border-black focus:bg-white focus:shadow-[2px_2px_0_#fcc615]"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "All"
                      ? "All Categories"
                      : item}
                  </option>
                ))}
              </select>

              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-black/40"
                fill="none"
              >
                <path
                  d="m6 9 6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-lg border-2 border-black/10 bg-[#fffdf8] px-3 py-2 text-[10px] font-bold text-black outline-none transition-all duration-300 hover:border-black/20 focus:border-black focus:bg-white focus:shadow-[2px_2px_0_#fcc615]"
              >
                <option value="default">
                  Sort By
                </option>

                <option value="title-asc">
                  Title: A-Z
                </option>

                <option value="fee-low">
                  Delivery Fee: Low to High
                </option>

                <option value="fee-high">
                  Delivery Fee: High to Low
                </option>
              </select>

              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-black/40"
                fill="none"
              >
                <path
                  d="m6 9 6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-5">

            <div className="mb-3 flex items-center justify-between">
              <div className="h-3 w-24 animate-pulse rounded-full bg-black/10" />

              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#fc1d15]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#fcc615] [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-black/30 [animation-delay:300ms]" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
                >
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-black/[0.04] via-black/[0.08] to-black/[0.04]">
                    <div className="skeleton-shimmer absolute inset-0" />

                    <div className="absolute left-3 top-3 h-5 w-14 animate-pulse rounded-full bg-black/10" />

                    <div className="absolute bottom-4 left-1/2 h-20 w-14 -translate-x-1/2 animate-pulse rounded-md bg-black/10" />
                  </div>

                  <div className="space-y-2 p-3">
                    <div className="h-2.5 w-16 animate-pulse rounded-full bg-black/10" />
                    <div className="h-4 w-4/5 animate-pulse rounded-full bg-black/10" />
                    <div className="h-2.5 w-3/5 animate-pulse rounded-full bg-black/[0.07]" />
                    <div className="mt-3 h-7 w-full animate-pulse rounded-lg bg-black/[0.07]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-6 animate-[browseScaleIn_0.4s_ease-out_both] rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">

            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff0ed]">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-[#fc1d15]"
                fill="none"
              >
                <path
                  d="M12 8v5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="16.5"
                  r="1"
                  fill="currentColor"
                />
                <path
                  d="M10.3 4.5 3.8 16a2 2 0 0 0 1.75 3h12.9a2 2 0 0 0 1.75-3L13.7 4.5a2 2 0 0 0-3.4 0Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </div>

            <p className="mt-3 text-xs font-bold text-[#fc1d15]">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg border-2 border-black bg-[#fcc615] px-4 py-2 text-[10px] font-black text-black shadow-[2px_2px_0_#111] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#111]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Result Count */}
        {!loading && !error && (
          <div className="mt-5 flex animate-[browseFadeUp_0.5s_ease-out_both] items-center justify-between">

            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-[#fc1d15]" />

              <p className="text-[10px] font-bold text-black/50">
                <span className="font-black text-black">
                  {filteredBooks.length}
                </span>{" "}
                books found
              </p>
            </div>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[8px] font-black text-black/50 transition-all hover:border-[#fc1d15]/30 hover:text-[#fc1d15]"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Books */}
        {!loading &&
          !error &&
          filteredBooks.length > 0 && (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

              {filteredBooks.map((book, index) => (
                <div
                  key={book._id}
                  className="animate-[bookCardEnter_0.5s_ease-out_both] transition-transform duration-300 hover:-translate-y-1"
                  style={{
                    animationDelay: `${Math.min(
                      index * 60,
                      480
                    )}ms`,
                  }}
                >
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          )}

        {/* No Books */}
        {!loading &&
          !error &&
          filteredBooks.length === 0 && (
            <div className="mt-6 animate-[browseScaleIn_0.45s_ease-out_both] rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 animate-[emptyBookFloat_3s_ease-in-out_infinite] items-center justify-center rounded-xl bg-[#fff7dc]">

                <svg
                  viewBox="0 0 64 64"
                  className="h-9 w-9"
                  fill="none"
                >
                  <path
                    d="M12 12c0-2.2 1.8-4 4-4h18v40H16c-2.2 0-4 1.8-4 4V12Z"
                    fill="#fc1d15"
                    stroke="#111"
                    strokeWidth="2.5"
                  />

                  <path
                    d="M52 12c0-2.2-1.8-4-4-4H30v40h18c2.2 0 4 1.8 4 4V12Z"
                    fill="white"
                    stroke="#111"
                    strokeWidth="2.5"
                  />

                  <path
                    d="M19 18h9M19 25h9M37 18h9M37 25h9"
                    stroke="#111"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h2 className="mt-3 text-lg font-black text-black">
                No books found
              </h2>

              <p className="mt-1 text-[10px] font-medium text-black/45">
                Try another search or category.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setSort("default");
                }}
                className="mt-4 rounded-lg border-2 border-black bg-[#fc1d15] px-4 py-2 text-[10px] font-black text-white shadow-[2px_2px_0_#111] transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#111] active:translate-x-[1px] active:translate-y-[1px]"
              >
                Reset Filters
              </button>
            </div>
          )}
      </div>
    </main>
  );
}