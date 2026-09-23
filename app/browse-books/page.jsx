"use client";

import { useMemo, useState } from "react";
import BookCard from "@/components/BookCard";

const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    fee: 50,
    available: true,
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    fee: 70,
    available: true,
  },
  {
    id: 3,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Help",
    fee: 60,
    available: false,
  },
  {
    id: 4,
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    fee: 45,
    available: true,
  },
  {
    id: 5,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "History",
    fee: 80,
    available: true,
  },
  {
    id: 6,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    category: "Finance",
    fee: 55,
    available: false,
  },
];

export default function BrowseBooks() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const categories = [
    "All",
    "Fiction",
    "Technology",
    "Self Help",
    "History",
    "Finance",
  ];

  const filteredBooks = useMemo(() => {
    let result = books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());

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
      result = [...result].sort((a, b) => a.fee - b.fee);
    }

    if (sort === "fee-high") {
      result = [...result].sort((a, b) => b.fee - a.fee);
    }

    return result;
  }, [search, category, sort]);

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

            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "All"
                    ? "All Categories"
                    : item}
                </option>
              ))}
            </select>

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

        {/* Result Count */}
        <div className="mt-8">
          <p className="text-gray-600">
            {filteredBooks.length} books found
          </p>
        </div>

        {/* Books */}
        {filteredBooks.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
              />
            ))}
          </div>
        ) : (
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