"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  FiArrowLeft,
  FiBookOpen,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiUser,
  FiXCircle,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";

const API_URL = "http://localhost:5000";

export default function AllBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteBook, setDeleteBook] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const [toast, setToast] = useState(null);

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
    } catch (err) {
      console.error("FETCH ADMIN BOOKS ERROR:", err);
      setError(err.message || "Failed to load books");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const showToast = (type, message) => {
    setToast({
      type,
      message,
    });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const openDeleteModal = (book) => {
    setDeleteBook(book);
  };

  const closeDeleteModal = () => {
    if (removingId) return;
    setDeleteBook(null);
  };

  const handleDelete = async () => {
    if (!deleteBook?._id) {
      return;
    }

    const bookId = deleteBook._id;
    const bookTitle = deleteBook.title || "Book";

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
        previousBooks.filter(
          (book) => book._id !== bookId
        )
      );

      setDeleteBook(null);

      showToast(
        "success",
        `"${bookTitle}" was removed successfully.`
      );
    } catch (err) {
      console.error("REMOVE BOOK ERROR:", err);

      setDeleteBook(null);

      setError(
        err.message || "Failed to remove book"
      );

      showToast(
        "error",
        err.message || "Failed to remove book"
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Toast */}
      {toast && (
        <div className="fixed right-4 top-4 z-[200] w-[calc(100%-2rem)] max-w-sm sm:right-6 sm:top-6">
          <div
            className={`toast-enter overflow-hidden rounded-xl border bg-white shadow-xl ${
              toast.type === "success"
                ? "border-green-200"
                : "border-red-200"
            }`}
          >
            <div className="flex items-start gap-3 px-4 py-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  toast.type === "success"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {toast.type === "success" ? (
                  <FiCheckCircle size={18} />
                ) : (
                  <FiAlertCircle size={18} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold text-gray-900">
                  {toast.type === "success"
                    ? "Book Deleted"
                    : "Delete Failed"}
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {toast.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setToast(null)}
                className="text-gray-400 transition hover:text-gray-700"
              >
                <FiX size={16} />
              </button>
            </div>

            <div
              className={`toast-progress h-0.5 ${
                toast.type === "success"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteBook && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !removingId
            ) {
              closeDeleteModal();
            }
          }}
        >
          <div className="delete-modal w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <FiTrash2 size={21} />
              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={!!removingId}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40"
              >
                <FiX size={17} />
              </button>
            </div>

            <h2 className="mt-4 text-lg font-extrabold text-gray-900">
              Are you sure?
            </h2>

            <p className="mt-2 text-sm leading-5 text-gray-500">
              Do you really want to delete this book?
              This action cannot be undone.
            </p>

            <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
              {deleteBook.coverImage ? (
                <img
                  src={deleteBook.coverImage}
                  alt={deleteBook.title || "Book cover"}
                  className="h-12 w-9 shrink-0 rounded object-cover"
                />
              ) : (
                <div className="flex h-12 w-9 shrink-0 items-center justify-center rounded bg-gray-200 text-gray-400">
                  <FiBookOpen size={15} />
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-gray-900">
                  {deleteBook.title || "Untitled Book"}
                </p>

                <p className="mt-1 truncate text-[11px] text-gray-400">
                  {deleteBook.author || "Unknown Author"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2 rounded-lg bg-red-50 px-3 py-2.5">
              <FiAlertTriangle
                size={14}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <p className="text-[11px] leading-4 text-red-600">
                This book will be permanently removed.
              </p>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={!!removingId}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={!!removingId}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {removingId ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 size={14} />
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page */}
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-7">
        <div className="border-b border-gray-200 pb-5">
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 transition hover:bg-gray-50 hover:text-black"
          >
            <FiArrowLeft size={14} />
            Back to Dashboard
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#fc1d15]">
                BiblioDrop
              </p>

              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
                All Books
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View and manage all books available on BiblioDrop.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-lg bg-gray-200 px-3 py-2 text-xs font-bold text-gray-600">
              <FiBookOpen size={14} />

              {loading
                ? "Loading..."
                : `${books.length} Books`}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <FiAlertCircle
              size={17}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <p className="flex-1 text-sm font-semibold text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-xs font-bold text-red-500 hover:text-red-700"
            >
              Close
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#fc1d15]" />

            <p className="mt-3 text-sm font-semibold text-gray-500">
              Loading books...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && books.length === 0 && !error && (
          <div className="mt-5 rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <FiBookOpen size={22} />
            </div>

            <h2 className="mt-4 text-base font-extrabold text-black">
              No Books Found
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              There are no books in the system yet.
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && books.length > 0 && (
          <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-4 py-3">
              <h2 className="text-sm font-extrabold text-black">
                Book Library
              </h2>

              <p className="mt-0.5 text-[11px] text-gray-400">
                All registered books
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <TableHead>Book</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Librarian</TableHead>
                    <TableHead>Approval</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Published</TableHead>
                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {books.map((book) => {
                    const bookStatus = String(
                      book.status || "available"
                    ).toLowerCase();

                    const approvalStatus = String(
                      book.approvalStatus || "pending"
                    ).toLowerCase();

                    return (
                      <tr
                        key={book._id}
                        className="transition-colors hover:bg-gray-50/70"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {book.coverImage ? (
                              <img
                                src={book.coverImage}
                                alt={
                                  book.title || "Book cover"
                                }
                                className="h-11 w-8 shrink-0 rounded bg-gray-100 object-cover"
                              />
                            ) : (
                              <div className="flex h-11 w-8 shrink-0 items-center justify-center rounded bg-gray-100 text-gray-400">
                                <FiBookOpen size={15} />
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="max-w-[190px] truncate text-xs font-bold text-black">
                                {book.title ||
                                  "Untitled Book"}
                              </p>

                              {book.category && (
                                <p className="mt-0.5 text-[10px] text-gray-400">
                                  {book.category}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-xs font-medium text-gray-600">
                          {book.author || "Unknown"}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex max-w-[170px] items-center gap-2">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                              <FiUser size={13} />
                            </div>

                            <span className="truncate text-xs font-medium text-gray-600">
                              {book.librarianName ||
                                book.librarian ||
                                book.librarianEmail ||
                                "Unknown"}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <StatusBadge
                            type="approval"
                            status={approvalStatus}
                          />
                        </td>

                        <td className="px-4 py-3">
                          <StatusBadge
                            type="book"
                            status={bookStatus}
                          />
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold ${
                              book.published
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {book.published ? (
                              <FiCheckCircle size={11} />
                            ) : (
                              <FiClock size={11} />
                            )}

                            {book.published
                              ? "Published"
                              : "Not Published"}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              openDeleteModal(book)
                            }
                            disabled={
                              removingId === book._id
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
                          >
                            <FiTrash2 size={13} />
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes toastEnter {
          0% {
            opacity: 0;
            transform: translateX(35px) scale(0.96);
          }

          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes toastProgress {
          0% {
            transform: scaleX(1);
          }

          100% {
            transform: scaleX(0);
          }
        }

        @keyframes deleteModal {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .toast-enter {
          animation: toastEnter 0.35s ease-out forwards;
        }

        .toast-progress {
          transform-origin: left;
          animation: toastProgress 3.5s linear forwards;
        }

        .delete-modal {
          animation: deleteModal 0.25s ease-out forwards;
        }
      `}</style>
    </main>
  );
}

function TableHead({ children }) {
  return (
    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">
      {children}
    </th>
  );
}

function StatusBadge({ type, status }) {
  if (type === "approval") {
    if (status === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700">
          <FiCheckCircle size={11} />
          Approved
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md bg-red-100 px-2 py-1 text-[10px] font-bold text-red-700">
          <FiXCircle size={11} />
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-yellow-100 px-2 py-1 text-[10px] font-bold text-yellow-700">
        <FiClock size={11} />
        Pending
      </span>
    );
  }

  if (status === "available") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700">
        <FiCheckCircle size={11} />
        Available
      </span>
    );
  }

  if (status === "checked_out") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-700">
        <FiClock size={11} />
        Checked Out
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-600">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
