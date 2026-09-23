"use client";

import Link from "next/link";

const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    status: "Available",
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    status: "Checked Out",
  },
];

export default function ManageBooks() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Manage Books</h1>
            <p className="mt-2 text-gray-600">
              Manage your library inventory.
            </p>
          </div>

          <Link
            href="/dashboard/librarian/add-book"
            className="rounded-lg bg-black px-5 py-3 text-center font-semibold text-white hover:bg-gray-800"
          >
            + Add Book
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {books.map((book) => (
            <div
              key={book.id}
              className="rounded-xl bg-white p-6 shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">
                    {book.title}
                  </h2>

                  <p className="mt-1 text-gray-600">
                    {book.author}
                  </p>

                  <p className="mt-3 text-sm text-gray-500">
                    Category: {book.category}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    book.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {book.status}
                </span>
              </div>

              <div className="mt-5 flex gap-3">
                <button className="rounded-lg border px-4 py-2 hover:bg-gray-100">
                  Edit
                </button>

                <button className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}