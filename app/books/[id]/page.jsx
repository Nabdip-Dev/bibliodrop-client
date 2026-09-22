"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    fee: 50,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    available: true,
    description:
      "The Great Gatsby is a classic American novel set in the Jazz Age. It explores themes of wealth, love, dreams, and society.",
    dateAdded: "September 10, 2026",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Help",
    fee: 60,
    image:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e",
    available: true,
    description:
      "Atomic Habits explains how small daily improvements can create remarkable results and lasting change.",
    dateAdded: "September 12, 2026",
  },
  {
    id: 3,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    fee: 45,
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    available: false,
    description:
      "The Hobbit follows Bilbo Baggins on an unexpected adventure filled with courage, friendship, and discovery.",
    dateAdded: "September 8, 2026",
  },
  {
    id: 4,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    fee: 80,
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765",
    available: true,
    description:
      "Clean Code provides practical principles and techniques for writing readable, maintainable, and professional software.",
    dateAdded: "September 14, 2026",
  },
  {
    id: 5,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    category: "Finance",
    fee: 55,
    image:
      "https://images.unsplash.com/photo-1589998059171-988d887df646",
    available: true,
    description:
      "A personal finance book discussing money, investing, financial education, and different approaches to building wealth.",
    dateAdded: "September 15, 2026",
  },
  {
    id: 6,
    title: "1984",
    author: "George Orwell",
    category: "Fiction",
    fee: 40,
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
    available: false,
    description:
      "1984 presents a dystopian society where surveillance, control, and propaganda shape everyday life.",
    dateAdded: "September 5, 2026",
  },
];

export default function BookDetails() {
  const params = useParams();

  const book = books.find(
    (item) => item.id === Number(params.id)
  );

  if (!book) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            Book Not Found
          </h1>

          <p className="mt-3 text-gray-500">
            The book you are looking for does not exist.
          </p>

          <Link
            href="/browse-books"
            className="mt-6 inline-block rounded-lg bg-black px-5 py-3 text-white"
          >
            Back to Books
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Back Button */}
        <Link
          href="/browse-books"
          className="mb-8 inline-block text-sm font-medium hover:opacity-60"
        >
          ← Back to Browse Books
        </Link>

        {/* Details Card */}
        <div className="grid overflow-hidden rounded-3xl border bg-white md:grid-cols-2">

          {/* Image */}
          <div className="bg-gray-100 p-8 md:p-12">
            <div className="mx-auto max-w-md overflow-hidden rounded-2xl shadow-lg">
              <img
                src={book.image}
                alt={book.title}
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-8 md:p-12">

            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              {book.category}
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              {book.title}
            </h1>

            <p className="mt-3 text-lg text-gray-500">
              by {book.author}
            </p>

            {/* Status */}
            <div className="mt-6">
              {book.available ? (
                <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                  Available
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                  Checked Out
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold">
                About this book
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                {book.description}
              </p>
            </div>

            {/* Info */}
            <div className="mt-8 grid grid-cols-2 gap-4 border-y py-6">

              <div>
                <p className="text-sm text-gray-500">
                  Delivery Fee
                </p>

                <p className="mt-1 text-2xl font-bold">
                  ₹{book.fee}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Date Added
                </p>

                <p className="mt-1 font-semibold">
                  {book.dateAdded}
                </p>
              </div>

            </div>

            {/* Request Button */}
            <button
              disabled={!book.available}
              className="mt-8 w-full rounded-xl bg-black px-6 py-4 font-semibold text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {book.available
                ? "Request Delivery"
                : "Currently Unavailable"}
            </button>

            <p className="mt-3 text-center text-xs text-gray-500">
              Delivery fee will be paid securely through Stripe.
            </p>

          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12 rounded-3xl border bg-white p-8">

          <h2 className="text-2xl font-bold">
            Reviews
          </h2>

          <p className="mt-2 text-gray-500">
            Reviews from readers who have successfully received this book.
          </p>

          <div className="mt-8 border-t pt-6">
            <p className="text-gray-500">
              No reviews yet.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}