"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookDetails() {
  const params = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/books/${params.id}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Book not found");
          }

          throw new Error("Failed to fetch book");
        }

        const data = await response.json();

        setBook(data);
      } catch (err) {
        console.error("BOOK DETAILS ERROR:", err);
        setError(err.message || "Failed to load book.");
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchBook();
    }
  }, [params?.id]);

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid animate-pulse gap-8 rounded-xl bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">
            <div className="min-h-[400px] rounded-xl bg-gray-200" />

            <div className="space-y-5">
              <div className="h-6 w-24 rounded bg-gray-200" />
              <div className="h-10 w-3/4 rounded bg-gray-200" />
              <div className="h-6 w-1/2 rounded bg-gray-200" />
              <div className="h-24 rounded bg-gray-200" />
              <div className="h-32 rounded bg-gray-200" />
              <div className="h-12 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error / Not Found
  if (error || !book) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Book Not Found
          </h1>

          <p className="mt-2 text-gray-600">
            {error || "The book you are looking for does not exist."}
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

  const isAvailable = book.status === "available";

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Book Details */}
        <div className="grid gap-8 rounded-xl bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">

          {/* Cover */}
          <div className="flex min-h-[400px] items-center justify-center overflow-hidden rounded-xl bg-gray-100">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="h-full max-h-[500px] w-full object-cover"
              />
            ) : (
              <span className="text-8xl">
                📚
              </span>
            )}
          </div>

          {/* Information */}
          <div>

            {/* Category */}
            {book.category && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                {book.category}
              </span>
            )}

            {/* Title */}
            <h1 className="mt-4 text-4xl font-bold">
              {book.title}
            </h1>

            {/* Author */}
            <p className="mt-3 text-lg text-gray-600">
              By {book.author}
            </p>

            {/* Description */}
            <p className="mt-6 leading-7 text-gray-700">
              {book.description}
            </p>

            {/* Book Information */}
            <div className="mt-6 space-y-3 border-t pt-6">

              <p>
                <span className="font-semibold">
                  Delivery Fee:
                </span>{" "}
                ₹{book.deliveryFee}
              </p>

              <p>
                <span className="font-semibold">
                  Published:
                </span>{" "}
                {book.published
                  ? "Published"
                  : "Not Published"}
              </p>

              <p>
                <span className="font-semibold">
                  Status:
                </span>{" "}

                {isAvailable ? (
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
              disabled={!isAvailable}
              className={`mt-8 w-full rounded-lg px-5 py-3 font-semibold text-white ${
                isAvailable
                  ? "bg-black hover:bg-gray-800"
                  : "cursor-not-allowed bg-gray-400"
              }`}
            >
              {isAvailable
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