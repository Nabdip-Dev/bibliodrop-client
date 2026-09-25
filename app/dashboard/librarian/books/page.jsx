"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiBookOpen,
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiArrowUpRight,
  FiCheckCircle,
  FiClock,
  FiX,
  FiSearch,
  FiLayers,
  FiAlertTriangle,
  FiRefreshCw,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

const API_URL = "http://localhost:5000";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteBook, setDeleteBook] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [librarianId, setLibrarianId] = useState("");

  // =========================
  // GET CURRENT LIBRARIAN
  // =========================
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: session } = await authClient.getSession();

        if (!session?.user) {
          setLoading(false);
          return;
        }

        setLibrarianId(session.user.id);
      } catch (error) {
        console.error("SESSION ERROR:", error);
        setToast("Failed to get librarian session.");
        setLoading(false);
      }
    };

    getSession();
  }, []);

  // =========================
  // FETCH THIS LIBRARIAN'S BOOKS
  // =========================
  const fetchBooks = async () => {
    if (!librarianId) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/books?librarianId=${encodeURIComponent(
          librarianId
        )}&page=1&limit=12`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch books");
      }

      setBooks(
        Array.isArray(data?.books)
          ? data.books
          : Array.isArray(data)
            ? data
            : []
      );
    } catch (error) {
      console.error("FETCH BOOKS ERROR:", error);
      setBooks([]);
      setToast(error.message || "Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!librarianId) return;

    fetchBooks();
  }, [librarianId]);

  // =========================
  // TOAST
  // =========================
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [toast]);

  // =========================
  // FILTER
  // =========================
  const searchText = search.trim().toLowerCase();

  const filteredBooks = books.filter((book) => {
    if (!searchText) return true;

    return (
      book.title?.toLowerCase().includes(searchText) ||
      book.author?.toLowerCase().includes(searchText) ||
      book.category?.toLowerCase().includes(searchText)
    );
  });

  // =========================
  // TOGGLE BOOK STATUS
  // AVAILABLE <-> CHECKED OUT
  // =========================
  const handleStatusToggle = async (book) => {
    if (!book?._id || !librarianId) return;

    const currentStatus =
      String(book.status || "").toLowerCase() === "available"
        ? "available"
        : "checked_out";

    const nextStatus =
      currentStatus === "available" ? "checked_out" : "available";

    try {
      setUpdatingStatusId(book._id);
      setToast("");

      const response = await fetch(
        `${API_URL}/books/${book._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
            librarianId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update book status"
        );
      }

      // Update the current book in UI
      setBooks((currentBooks) =>
        currentBooks.map((currentBook) =>
          currentBook._id === book._id
            ? {
              ...currentBook,
              status: data.book?.status || nextStatus,
            }
            : currentBook
        )
      );

      setToast(
        nextStatus === "available"
          ? `"${book.title}" is now Available.`
          : `"${book.title}" is now Checked Out.`
      );
    } catch (error) {
      console.error("UPDATE BOOK STATUS ERROR:", error);

      setToast(
        error.message || "Failed to update book status."
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // =========================
  // DELETE BOOK
  // =========================
  const handleDelete = async () => {
    if (!deleteBook || !librarianId) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `${API_URL}/books/${deleteBook._id}?librarianId=${encodeURIComponent(
          librarianId
        )}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete book"
        );
      }

      setBooks((currentBooks) =>
        currentBooks.filter(
          (book) => book._id !== deleteBook._id
        )
      );

      const deletedTitle = deleteBook.title;

      setDeleteBook(null);
      setToast(`"${deletedTitle}" deleted successfully.`);
    } catch (error) {
      console.error("DELETE ERROR:", error);

      setToast(
        error.message || "Failed to delete book."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffdf8] px-3 py-5 sm:px-5">
      <div className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-[#fc1d15]/[0.04] blur-3xl" />

      <div className="pointer-events-none absolute -right-20 top-0 h-48 w-48 rounded-full bg-[#fcc615]/[0.07] blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-1.5">
              <span className="h-1 w-5 rounded-full bg-[#fc1d15]" />

              <span className="text-[8px] font-black uppercase tracking-[0.18em] text-[#fc1d15]">
                Inventory
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-black sm:text-3xl">
              Manage{" "}
              <span className="text-[#fc1d15]">Books</span>
            </h1>

            <p className="mt-1 text-[11px] text-gray-400">
              Manage your library collection.
            </p>
          </div>

          <Link
            href="/dashboard/librarian/add-book"
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-black px-3 py-2 text-[10px] font-black text-white shadow-[3px_3px_0_#fcc615] transition-all duration-300 hover:bg-[#fc1d15]"
          >
            <FiPlus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
            Add Book
          </Link>
        </div>

        {/* STATS */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {/* TOTAL */}
          <div className="rounded-xl border border-black/[0.06] bg-white p-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fc1d15]/10 text-[#fc1d15]">
                <FiBookOpen className="h-3.5 w-3.5" />
              </div>

              <span className="text-lg font-black text-black">
                {books.length}
              </span>
            </div>

            <p className="mt-2 text-[8px] font-black uppercase tracking-wider text-gray-400">
              Total
            </p>
          </div>

          {/* AVAILABLE */}
          <div className="rounded-xl border border-black/[0.06] bg-white p-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <FiCheckCircle className="h-3.5 w-3.5" />
              </div>

              <span className="text-lg font-black text-black">
                {
                  books.filter(
                    (book) => book.status === "available"
                  ).length
                }
              </span>
            </div>

            <p className="mt-2 text-[8px] font-black uppercase tracking-wider text-gray-400">
              Available
            </p>
          </div>

          {/* CHECKED OUT */}
          <div className="rounded-xl bg-black p-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fcc615] text-black">
                <FiClock className="h-3.5 w-3.5" />
              </div>

              <span className="text-lg font-black text-white">
                {
                  books.filter(
                    (book) => book.status !== "available"
                  ).length
                }
              </span>
            </div>

            <p className="mt-2 text-[8px] font-black uppercase tracking-wider text-gray-500">
              Checked Out
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mt-4 rounded-xl border border-black/[0.06] bg-white p-2 shadow-sm">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books..."
              className="w-full rounded-lg border border-gray-200 bg-[#fffdf9] py-2 pl-9 pr-3 text-[11px] font-medium outline-none transition focus:border-[#fc1d15]/40 focus:ring-2 focus:ring-[#fc1d15]/[0.05]"
            />
          </div>
        </div>

        {/* COLLECTION */}
        <div className="mt-5">
          <div className="mb-2.5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-black">
                Your Collection
              </h2>

              <p className="text-[9px] text-gray-400">
                {loading
                  ? "Loading books..."
                  : `${filteredBooks.length} books found`}
              </p>
            </div>

            <FiLayers className="h-4 w-4 text-[#fc1d15]" />
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="grid gap-2.5 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-[130px] animate-pulse rounded-[15px] border border-black/[0.06] bg-white shadow-sm"
                />
              ))}
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid gap-2.5 md:grid-cols-2">
              {filteredBooks.map((book, index) => {
                const isAvailable =
                  book.status === "available";

                const isUpdating =
                  updatingStatusId === book._id;

                const approvalStatus =
                  String(
                    book.approvalStatus || "pending"
                  ).toLowerCase();

                return (
                  <article
                    key={book._id}
                    className="group relative overflow-hidden rounded-[15px] border border-black/[0.06] bg-white p-2.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    style={{
                      animation: `manageBookIn .4s ease-out ${index * 70
                        }ms both`,
                    }}
                  >
                    <div
                      className={`absolute left-0 top-0 h-0.5 w-full ${isAvailable
                          ? "bg-emerald-500"
                          : "bg-[#fc1d15]"
                        }`}
                    />

                    <div className="flex gap-2.5">
                      {/* COVER */}
                      <div className="flex h-[78px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#fff8e5] to-[#f5f2ec]">
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.title || "Book cover"}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <FiBookOpen className="h-6 w-6 text-[#fc1d15] transition-transform duration-300 group-hover:scale-110" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[7px] font-black uppercase tracking-wider text-[#fc1d15]">
                              {book.category ||
                                "Uncategorized"}
                            </span>

                            <h3 className="mt-0.5 truncate text-[12px] font-black text-gray-900">
                              {book.title ||
                                "Untitled Book"}
                            </h3>

                            <p className="mt-0.5 truncate text-[9px] text-gray-400">
                              {book.author ||
                                "Unknown Author"}
                            </p>
                          </div>

                          {/* STATUS */}
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusToggle(book)
                            }
                            disabled={isUpdating}
                            title={
                              isAvailable
                                ? "Change to Checked Out"
                                : "Change to Available"
                            }
                            className={`shrink-0 rounded-full px-2 py-1 text-[7px] font-black transition-all disabled:cursor-wait disabled:opacity-60 ${isAvailable
                                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                : "bg-red-50 text-[#fc1d15] hover:bg-red-100"
                              }`}
                          >
                            {isUpdating ? (
                              <span className="inline-flex items-center gap-1">
                                <FiRefreshCw className="h-2.5 w-2.5 animate-spin" />
                                Updating
                              </span>
                            ) : (
                              <>
                                {isAvailable
                                  ? "Available"
                                  : "Checked Out"}
                              </>
                            )}
                          </button>
                        </div>

                        {/* APPROVAL STATUS */}
                        <div className="mt-2 flex items-center gap-1.5">
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[7px] font-black ${approvalStatus === "approved"
                                ? "bg-emerald-50 text-emerald-600"
                                : approvalStatus ===
                                  "rejected"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-orange-50 text-orange-600"
                              }`}
                          >
                            {approvalStatus === "approved"
                              ? "Approved"
                              : approvalStatus ===
                                "rejected"
                                ? "Rejected"
                                : "Pending Approval"}
                          </span>
                        </div>

                        {/* ACTIONS */}
                        <div className="mt-2.5 flex items-center gap-1.5">
                          <Link
                            href={`/dashboard/librarian/books/edit/${book._id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[8px] font-black text-gray-600 transition hover:bg-black hover:text-white"
                          >
                            <FiEdit3 className="h-2.5 w-2.5" />
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteBook(book)
                            }
                            className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 text-[8px] font-black text-[#fc1d15] transition hover:bg-[#fc1d15] hover:text-white"
                          >
                            <FiTrash2 className="h-2.5 w-2.5" />
                            Delete
                          </button>

                          <Link
                            href={`/books/${book._id}`}
                            className="ml-auto flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:border-[#fcc615] hover:bg-[#fcc615] hover:text-black"
                          >
                            <FiArrowUpRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center">
              <FiSearch className="mx-auto h-5 w-5 text-[#fc1d15]" />

              <p className="mt-2 text-xs font-black text-gray-700">
                No books found
              </p>

              <p className="mt-1 text-[9px] text-gray-400">
                {search
                  ? "Try another search."
                  : "You have not added any books yet."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      {deleteBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-black/[0.08] bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#fc1d15]">
                  <FiAlertTriangle className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-black text-black">
                    Delete Book?
                  </h3>

                  <p className="mt-0.5 text-[9px] text-gray-400">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDeleteBook(null)}
                disabled={deleting}
                className="text-gray-400 transition hover:text-black"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-[#fffdf8] p-3">
              <p className="text-[10px] font-bold text-gray-500">
                You are about to delete:
              </p>

              <p className="mt-1 truncate text-xs font-black text-black">
                {deleteBook.title}
              </p>

              <p className="mt-0.5 truncate text-[9px] text-gray-400">
                {deleteBook.author}
              </p>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteBook(null)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-[9px] font-black text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-lg bg-[#fc1d15] px-3 py-2 text-[9px] font-black text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {deleting
                  ? "Deleting..."
                  : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-xs -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-xl bg-black px-3 py-2.5 text-white shadow-lg">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fcc615] text-black">
              <FiCheckCircle className="h-3.5 w-3.5" />
            </div>

            <p className="text-[9px] font-bold">
              {toast}
            </p>

            <button
              type="button"
              onClick={() => setToast("")}
              className="ml-auto text-gray-400 hover:text-white"
            >
              <FiX className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}