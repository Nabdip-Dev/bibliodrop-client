"use client";

import { useState } from "react";
import BookCard from "@/components/BookCard";

const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    fee: 50,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    available: true,
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Help",
    fee: 60,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e",
    available: true,
  },
  {
    id: 3,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    fee: 45,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    available: false,
  },
  {
    id: 4,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    fee: 80,
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765",
    available: true,
  },
  {
    id: 5,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    category: "Finance",
    fee: 55,
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646",
    available: true,
  },
  {
    id: 6,
    title: "1984",
    author: "George Orwell",
    category: "Fiction",
    fee: 40,
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
    available: false,
  },
];

export default function BrowseBooks() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || book.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Explore Collection
          </p>

          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Browse Books
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Discover books from local libraries and independent book owners.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-10 flex flex-col gap-4 rounded-2xl border bg-white p-5 md:flex-row">

          <input
            type="text"
            placeholder="Search by book name or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-lg border px-4 py-3 outline-none focus:ring-2"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border px-4 py-3 outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Fiction">Fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Self Help">Self Help</option>
          </select>

        </div>

        {/* Result */}
        {filteredBooks.length === 0 ? (
          <div className="rounded-2xl border bg-white py-20 text-center">
            <h2 className="text-xl font-semibold">
              No books found
            </h2>

            <p className="mt-2 text-gray-500">
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}