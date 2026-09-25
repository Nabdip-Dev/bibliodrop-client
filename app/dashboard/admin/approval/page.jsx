"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

export default function ApprovalPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const fetchPendingBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/admin/books/pending`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load pending books"
        );
      }

      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FETCH PENDING BOOKS ERROR:", error);
      setError(error.message || "Failed to load pending books");
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchPendingBooks();
  }, []);

  const handleApprove = async (bookId) => {
    try {
      setProcessingId(bookId);
      setError("");

      const response = await fetch(
        `${API_URL}/admin/books/${bookId}/approve`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to approve book"
        );
      }

      setBooks((previousBooks) =>
        previousBooks.filter((book) => book._id !== bookId)
      );
    } catch (error) {
      console.error("APPROVE BOOK ERROR:", error);
      setError(error.message || "Failed to approve book");
    } finally {
      setProcessingId(null);
    }

  };

  const handleReject = async (bookId) => {
    try {
      setProcessingId(bookId);
      setError("");

      const response = await fetch(
        `${API_URL}/admin/books/${bookId}/reject`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to reject book"
        );
      }

      setBooks((previousBooks) =>
        previousBooks.filter((book) => book._id !== bookId)
      );
    } catch (error) {
      console.error("REJECT BOOK ERROR:", error);
      setError(error.message || "Failed to reject book");
    } finally {
      setProcessingId(null);
    }

  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-[#fc1d15]">
            BiblioDrop
          </p>

          <h1 className="mt-2 text-3xl font-black text-black">
            Approval Queue
          </h1>

          <p className="mt-2 text-gray-600">
            Review books submitted by librarians.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="font-semibold text-gray-600">
              Loading pending books...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && books.length === 0 && !error && (
          <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-4xl">✅</div>

            <h2 className="mt-4 text-xl font-bold text-black">
              No Pending Books
            </h2>

            <p className="mt-2 text-gray-500">
              There are no books waiting for approval.
            </p>
          </div>
        )}

        {/* Books */}
        {!loading && books.length > 0 && (
          <div className="mt-8 space-y-5">

            {books.map((book) => (
              <div
                key={book._id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-6 sm:flex-row">

                  {/* Cover */}
                  <div className="shrink-0">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title || "Book cover"}
                        className="h-40 w-28 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-40 w-28 items-center justify-center rounded-lg bg-gray-200 text-3xl">
                        📚
                      </div>
                    )}
                  </div>

                  {/* Information */}
                  <div className="flex-1">

                    <div className="flex flex-col justify-between gap-3 sm:flex-row">
                      <div>
                        <h2 className="text-2xl font-black text-black">
                          {book.title || "Untitled Book"}
                        </h2>

                        <p className="mt-1 text-gray-600">
                          Author: {book.author || "Unknown"}
                        </p>
                      </div>

                      <span className="h-fit w-fit rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-700">
                        Pending
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                      <p>
                        <span className="font-semibold text-gray-800">
                          Category:
                        </span>{" "}
                        {book.category || "N/A"}
                      </p>

                      <p>
                        <span className="font-semibold text-gray-800">
                          Delivery Fee:
                        </span>{" "}
                        ₹{Number(book.deliveryFee || 0)}
                      </p>

                      <p>
                        <span className="font-semibold text-gray-800">
                          Librarian:
                        </span>{" "}
                        {book.librarianName || "Unknown"}
                      </p>

                      {book.librarianEmail && (
                        <p>
                          <span className="font-semibold text-gray-800">
                            Email:
                          </span>{" "}
                          {book.librarianEmail}
                        </p>
                      )}
                    </div>

                    {book.description && (
                      <div className="mt-4 rounded-lg bg-gray-50 p-4">
                        <p className="text-sm leading-6 text-gray-600">
                          {book.description}
                        </p>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="mt-5 flex gap-3">

                      <button
                        type="button"
                        onClick={() => handleApprove(book._id)}
                        disabled={processingId !== null}
                        className="rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {processingId === book._id
                          ? "Processing..."
                          : "Approve"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReject(book._id)}
                        disabled={processingId !== null}
                        className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {processingId === book._id
                          ? "Processing..."
                          : "Reject"}
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </main>

  );
}