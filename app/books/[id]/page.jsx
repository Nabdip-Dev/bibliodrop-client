"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    description:
      "A classic American novel about wealth, love, dreams, and society in the 1920s.",
    fee: 50,
    available: true,
    owner: "Rahim Ahmed",
    publishedDate: "2026-09-01",
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    description:
      "A practical guide to writing clean, readable, maintainable, and professional code.",
    fee: 70,
    available: true,
    owner: "Karim Hasan",
    publishedDate: "2026-08-28",
  },
  {
    id: 3,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Help",
    description:
      "A practical book about building good habits and breaking bad ones through small changes.",
    fee: 60,
    available: false,
    owner: "Nusrat Jahan",
    publishedDate: "2026-08-20",
  },
];

export default function BookDetails() {
  const params = useParams();

  const book = books.find(
    (item) => item.id === Number(params.id)
  );

  if (!book) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Book Not Found
          </h1>

          <p className="mt-2 text-gray-600">
            The book you are looking for does not exist.
          </p>

          <Link
            href="/browse-books"
            className="mt-5 inline-block rounded-lg bg-black px-5 py-3 text-white"
          >
            Back to Browse Books
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Book Details */}
        <div className="grid gap-8 rounded-xl bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">

          {/* Cover */}
          <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-gray-100">
            <span className="text-8xl">
              📚
            </span>
          </div>

          {/* Information */}
          <div>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              {book.category}
            </span>

            <h1 className="mt-4 text-4xl font-bold">
              {book.title}
            </h1>

            <p className="mt-3 text-lg text-gray-600">
              By {book.author}
            </p>

            <p className="mt-6 leading-7 text-gray-700">
              {book.description}
            </p>

            <div className="mt-6 space-y-3 border-t pt-6">

              <p>
                <span className="font-semibold">
                  Delivery Fee:
                </span>{" "}
                ৳{book.fee}
              </p>

              <p>
                <span className="font-semibold">
                  Owner:
                </span>{" "}
                {book.owner}
              </p>

              <p>
                <span className="font-semibold">
                  Published:
                </span>{" "}
                {book.publishedDate}
              </p>

              <p>
                <span className="font-semibold">
                  Status:
                </span>{" "}
                {book.available ? (
                  <span className="font-semibold text-green-600">
                    Available
                  </span>
                ) : (
                  <span className="font-semibold text-red-600">
                    Checked Out
                  </span>
                )}
              </p>

            </div>

            {/* Request Delivery */}
            <button
              disabled={!book.available}
              className={`mt-8 w-full rounded-lg px-5 py-3 font-semibold text-white ${
                book.available
                  ? "bg-black hover:bg-gray-800"
                  : "cursor-not-allowed bg-gray-400"
              }`}
            >
              {book.available
                ? "Request Delivery"
                : "Currently Unavailable"}
            </button>

          </div>
        </div>

        {/* Reviews */}
        <section className="mt-10 rounded-xl bg-white p-6 shadow-sm md:p-8">

          <h2 className="text-2xl font-bold">
            Reviews
          </h2>

          <p className="mt-2 text-gray-600">
            Reviews from readers who received this book.
          </p>

          <div className="mt-6 rounded-lg bg-gray-50 p-6 text-center">
            <p className="text-gray-600">
              No reviews yet.
            </p>
          </div>

        </section>

      </div>
    </main>
  );
}