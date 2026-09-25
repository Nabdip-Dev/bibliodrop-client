"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

export default function AllBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/admin/books`, {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load books");
      }

      const booksData = Array.isArray(data)
        ? data
        : Array.isArray(data.books)
          ? data.books
          : [];

      setBooks(booksData);
    } catch (error) {
      console.error("FETCH ADMIN BOOKS ERROR:", error);
      setError(error.message || "Failed to load books");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleRemove = async (bookId) => {
    if (!bookId) {
      setError("Book ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to remove this book?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingId(bookId);
      setError("");

      const response = await fetch(
        `${API_URL}/admin/books/${bookId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to remove book"
        );
      }

      setBooks((previousBooks) =>
        previousBooks.filter((book) => book._id !== bookId)
      );
    } catch (error) {
      console.error("REMOVE BOOK ERROR:", error);
      setError(error.message || "Failed to remove book");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-[#fc1d15]">
            BiblioDrop
          </p>

          <h1 className="mt-2 text-3xl font-black text-black">
            All Books
          </h1>

          <p className="mt-2 text-gray-600">
            View all books available on BiblioDrop.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}

        {loading && (
          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#fc1d15]" />

            <p className="mt-4 font-semibold text-gray-600">
              Loading books...
            </p>
          </div>
        )}

        {!loading && books.length === 0 && !error && (
          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow">
            <div className="text-4xl">📚</div>

            <h2 className="mt-4 text-xl font-bold text-black">
              No Books Found
            </h2>

            <p className="mt-2 text-gray-500">
              There are no books in the system yet.
            </p>
          </div>
        )}

        {!loading && books.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow">
            <table className="w-full min-w-[850px]">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    Book
                  </th>

                  <th className="px-6 py-4 text-left">
                    Author
                  </th>

                  <th className="px-6 py-4 text-left">
                    Librarian
                  </th>

                  <th className="px-6 py-4 text-left">
                    Approval
                  </th>

                  <th className="px-6 py-4 text-left">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left">
                    Published
                  </th>

                  <th className="px-6 py-4 text-left">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {books.map((book) => {
                  const bookStatus = String(
                    book.status || "available"
                  ).toLowerCase();

                  const approvalStatus = String(
                    book.approvalStatus || "pending"
                  ).toLowerCase();

                  const isRemoving =
                    removingId === book._id;

                  return (
                    <tr
                      key={book._id}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {book.coverImage ? (
                            <img
                              src={book.coverImage}
                              alt={
                                book.title ||
                                "Book cover"
                              }
                              className="h-14 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-10 items-center justify-center rounded bg-gray-200">
                              📚
                            </div>
                          )}

                          <span className="font-semibold text-black">
                            {book.title ||
                              "Untitled Book"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {book.author || "Unknown"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {book.librarianName ||
                          book.librarian ||
                          book.librarianEmail ||
                          "Unknown"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${approvalStatus ===
                              "approved"
                              ? "bg-green-100 text-green-700"
                              : approvalStatus ===
                                "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {approvalStatus
                            .charAt(0)
                            .toUpperCase() +
                            approvalStatus.slice(1)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${bookStatus ===
                              "available"
                              ? "bg-green-100 text-green-700"
                              : bookStatus ===
                                "checked_out"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-gray-200 text-gray-700"
                            }`}
                        >
                          {bookStatus ===
                            "checked_out"
                            ? "Checked Out"
                            : bookStatus
                              .charAt(0)
                              .toUpperCase() +
                            bookStatus.slice(1)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${book.published
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-700"
                            }`}
                        >
                          {book.published
                            ? "Published"
                            : "Not Published"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(book._id)
                          }
                          disabled={isRemoving}
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isRemoving
                            ? "Removing..."
                            : "Remove"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}