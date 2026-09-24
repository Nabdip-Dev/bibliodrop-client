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

  // Get unique categories from backend data
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(books.map((book) => book.category).filter(Boolean)),
    ];

    return ["All", ...uniqueCategories];
  }, [books]);

  // Search, filter and sort
  const filteredBooks = useMemo(() => {
    let result = books.filter((book) => {
      const matchesSearch =
        book.title?.toLowerCase().includes(search.toLowerCase()) ||
        book.author?.toLowerCase().includes(search.toLowerCase());

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
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            Browse Books
          </h1>

          <p className="mt-3 text-gray-600">
            Find your next favorite book from local libraries.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-10 rounded-xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">

            {/* Search */}
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Categories" : item}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
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

          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-xl bg-gray-200"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-10 rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-red-500">
              {error}
            </p>
          </div>
        )}

        {/* Result Count */}
        {!loading && !error && (
          <div className="mt-8">
            <p className="text-gray-600">
              {filteredBooks.length} books found
            </p>
          </div>
        )}

        {/* Books */}
        {!loading && !error && filteredBooks.length > 0 && (
          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard
                key={book._id}
                book={book}
              />
            ))}
          </div>
        )}

        {/* No Books */}
        {!loading && !error && filteredBooks.length === 0 && (
          <div className="mt-10 rounded-xl bg-white p-12 text-center shadow-sm">
            <div className="text-5xl">
              📚
            </div>

            <h2 className="mt-4 text-xl font-bold">
              No books found
            </h2>

            <p className="mt-2 text-gray-600">
              Try another search or category.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}