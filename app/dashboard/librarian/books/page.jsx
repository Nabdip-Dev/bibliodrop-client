"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  FiGlobe,
  FiEyeOff,
  FiChevronDown,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

const API_URL = "http://localhost:5000";

const availabilityOptions = [
  {
    value: "available",
    label: "Available",
  },
  {
    value: "unavailable",
    label: "Unavailable",
  },
  {
    value: "out_of_stock",
    label: "Out of Stock",
  },
];

function getAvailabilityLabel(status) {
  return (
    availabilityOptions.find(
      (item) => item.value === status
    )?.label || "Unavailable"
  );
}

function getAvailabilityStyles(status) {
  switch (status) {
    case "available":
      return {
        badge:
          "bg-emerald-50 text-emerald-700 border-emerald-100",
        dot: "bg-emerald-500",
      };

    case "out_of_stock":
      return {
        badge:
          "bg-red-50 text-red-600 border-red-100",
        dot: "bg-red-500",
      };

    default:
      return {
        badge:
          "bg-amber-50 text-amber-700 border-amber-100",
        dot: "bg-amber-500",
      };
  }
}

function getApprovalStyles(status) {
  switch (status) {
    case "approved":
      return {
        icon: FiCheckCircle,
        label: "Approved",
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-100",
      };

    case "rejected":
      return {
        icon: FiX,
        label: "Rejected",
        className:
          "bg-red-50 text-red-600 border-red-100",
      };

    default:
      return {
        icon: FiClock,
        label: "Pending",
        className:
          "bg-amber-50 text-amber-700 border-amber-100",
      };
  }
}

export default function LibrarianBooksPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteBook, setDeleteBook] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] =
    useState(null);
  const [updatingPublishId, setUpdatingPublishId] =
    useState(null);
  const [librarianId, setLibrarianId] = useState("");
  const [error, setError] = useState("");

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const loadBooks = async (id = librarianId) => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/books?librarianId=${encodeURIComponent(
          id
        )}&page=1&limit=100`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load books");
      }

      const data = await response.json();

      const loadedBooks = Array.isArray(data)
        ? data
        : Array.isArray(data.books)
        ? data.books
        : [];

      setBooks(loadedBooks);
    } catch (error) {
      console.error("LOAD BOOKS ERROR:", error);
      setError(
        "Failed to load books. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getSessionAndBooks = async () => {
      try {
        const { data: session } =
          await authClient.getSession();

        if (!session?.user?.id) {
          setError(
            "Unable to find librarian session."
          );
          setLoading(false);
          return;
        }

        const id = session.user.id;

        setLibrarianId(id);

        await loadBooks(id);
      } catch (error) {
        console.error("SESSION ERROR:", error);

        setError(
          "Unable to load your librarian account."
        );

        setLoading(false);
      }
    };

    getSessionAndBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return books;

    return books.filter((book) => {
      const title =
        book.title?.toLowerCase() || "";

      const author =
        book.author?.toLowerCase() || "";

      const category =
        book.category?.toLowerCase() || "";

      const id =
        book._id?.toString().toLowerCase() || "";

      return (
        title.includes(keyword) ||
        author.includes(keyword) ||
        category.includes(keyword) ||
        id.includes(keyword)
      );
    });
  }, [books, search]);

  const totalBooks = books.length;

  const availableBooks = books.filter(
    (book) => book.status === "available"
  ).length;

  const unavailableBooks = books.filter(
    (book) => book.status === "unavailable"
  ).length;

  const outOfStockBooks = books.filter(
    (book) => book.status === "out_of_stock"
  ).length;

  const publishedBooks = books.filter(
    (book) => book.published === true
  ).length;

  const handleStatusChange = async (
    book,
    nextStatus
  ) => {
    if (
      !book?._id ||
      !librarianId ||
      !nextStatus ||
      book.status === nextStatus
    ) {
      return;
    }

    try {
      setUpdatingStatusId(book._id);

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

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update book status"
        );
      }

      setBooks((currentBooks) =>
        currentBooks.map((item) =>
          item._id === book._id
            ? data.book || {
                ...item,
                status: nextStatus,
              }
            : item
        )
      );

      showToast("Availability updated.");
    } catch (error) {
      console.error(
        "STATUS UPDATE ERROR:",
        error
      );

      showToast(
        error.message ||
          "Failed to update availability."
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handlePublishChange = async (book) => {
    if (!book?._id || !librarianId) return;

    const shouldPublish =
      book.published !== true;

    if (
      shouldPublish &&
      book.approvalStatus !== "approved"
    ) {
      showToast(
        "Only approved books can be published."
      );
      return;
    }

    try {
      setUpdatingPublishId(book._id);

      const response = await fetch(
        `${API_URL}/books/${book._id}/publish`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            published: shouldPublish,
            librarianId,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update publication status"
        );
      }

      setBooks((currentBooks) =>
        currentBooks.map((item) =>
          item._id === book._id
            ? data.book || {
                ...item,
                published: shouldPublish,
              }
            : item
        )
      );

      showToast(
        shouldPublish
          ? "Book published."
          : "Book unpublished."
      );
    } catch (error) {
      console.error(
        "PUBLISH UPDATE ERROR:",
        error
      );

      showToast(
        error.message ||
          "Failed to update publication status."
      );
    } finally {
      setUpdatingPublishId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteBook?._id || !librarianId) {
      return;
    }

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

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete book"
        );
      }

      setBooks((currentBooks) =>
        currentBooks.filter(
          (book) =>
            book._id !== deleteBook._id
        )
      );

      setDeleteBook(null);

      showToast("Book deleted successfully.");
    } catch (error) {
      console.error(
        "DELETE BOOK ERROR:",
        error
      );

      showToast(
        error.message ||
          "Failed to delete book."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex items-center justify-between">
            <div>
              <div className="h-7 w-40 animate-pulse rounded-lg bg-gray-200" />
              <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="h-10 w-28 animate-pulse rounded-xl bg-gray-200" />
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-xl bg-gray-200"
                />
              )
            )}
          </div>

          <div className="space-y-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded-2xl bg-gray-200"
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <header className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ef3124]">
                <FiBookOpen />
                Library Management
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Books
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your library collection,
                availability and publication.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => loadBooks()}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
              >
                <FiRefreshCw />
                Refresh
              </button>

              <Link
                href="/dashboard/librarian/books/add"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#ef3124] px-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#d92b20]"
              >
                <FiPlus />
                Add Book
              </Link>
            </div>
          </div>
        </header>

        {/* ERROR */}

        {error && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="flex items-center gap-2">
              <FiAlertTriangle />
              {error}
            </div>

            <button
              type="button"
              onClick={() => loadBooks()}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white"
            >
              Retry
            </button>
          </div>
        )}

        {/* STATS */}

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">
                Total
              </span>
              <FiLayers className="text-gray-400" />
            </div>

            <p className="mt-2 text-xl font-bold text-gray-900">
              {totalBooks}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">
                Available
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>

            <p className="mt-2 text-xl font-bold text-gray-900">
              {availableBooks}
            </p>
          </div>

          <div className="rounded-xl border border-amber-100 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">
                Unavailable
              </span>
              <span className="h-2 w-2 rounded-full bg-amber-500" />
            </div>

            <p className="mt-2 text-xl font-bold text-gray-900">
              {unavailableBooks}
            </p>
          </div>

          <div className="rounded-xl border border-red-100 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">
                Out of Stock
              </span>
              <span className="h-2 w-2 rounded-full bg-red-500" />
            </div>

            <p className="mt-2 text-xl font-bold text-gray-900">
              {outOfStockBooks}
            </p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">
                Published
              </span>
              <FiGlobe className="text-blue-500" />
            </div>

            <p className="mt-2 text-xl font-bold text-gray-900">
              {publishedBooks}
            </p>
          </div>
        </div>

        {/* TOOLBAR */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search books, authors or categories..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-800 outline-none shadow-sm transition placeholder:text-gray-400 focus:border-red-300 focus:ring-2 focus:ring-red-50"
            />
          </div>

          <p className="text-sm font-medium text-gray-500">
            {filteredBooks.length}{" "}
            {filteredBooks.length === 1
              ? "book"
              : "books"}
          </p>
        </div>

        {/* BOOK LIST */}

        {filteredBooks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl text-red-500">
              <FiBookOpen />
            </div>

            <h2 className="text-lg font-bold text-gray-900">
              {search
                ? "No books found"
                : "No books yet"}
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
              {search
                ? "Try another search keyword."
                : "Add your first book to your library collection."}
            </p>

            {!search && (
              <Link
                href="/dashboard/librarian/books/add"
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#ef3124] px-4 text-sm font-bold text-white"
              >
                <FiPlus />
                Add Book
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBooks.map((book) => {
              const availability =
                getAvailabilityStyles(
                  book.status
                );

              const approval =
                getApprovalStyles(
                  book.approvalStatus
                );

              const ApprovalIcon =
                approval.icon;

              const statusUpdating =
                updatingStatusId ===
                book._id;

              const publishUpdating =
                updatingPublishId ===
                book._id;

              const canPublish =
                book.approvalStatus ===
                "approved";

              return (
                <article
                  key={book._id}
                  className="group rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm transition duration-200 hover:border-gray-300 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">

                    {/* COVER */}

                    <div className="h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={
                            book.title ||
                            "Book cover"
                          }
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <FiBookOpen className="text-2xl text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* MAIN INFO */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <h2 className="truncate text-base font-bold text-gray-900">
                            {book.title ||
                              "Untitled Book"}
                          </h2>

                          <p className="mt-0.5 truncate text-sm text-gray-500">
                            {book.author ||
                              "Unknown Author"}
                          </p>
                        </div>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${availability.badge}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${availability.dot}`}
                          />
                          {getAvailabilityLabel(
                            book.status
                          )}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                        <span>
                          <strong className="font-semibold text-gray-700">
                            Category:
                          </strong>{" "}
                          {book.category ||
                            "Not specified"}
                        </span>

                        <span className="hidden text-gray-300 sm:inline">
                          •
                        </span>

                        <span className="max-w-[180px] truncate">
                          <strong className="font-semibold text-gray-700">
                            ID:
                          </strong>{" "}
                          {book._id || "N/A"}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${approval.className}`}
                        >
                          <ApprovalIcon />
                          {approval.label}
                        </span>

                        {book.published ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                            <FiGlobe />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                            <FiEyeOff />
                            Unpublished
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CONTROLS */}

                    <div className="flex flex-col gap-2 md:w-52 md:shrink-0">
                      <div className="relative">
                        <select
                          value={
                            availabilityOptions.some(
                              (item) =>
                                item.value ===
                                book.status
                            )
                              ? book.status
                              : "unavailable"
                          }
                          disabled={
                            statusUpdating
                          }
                          onChange={(event) =>
                            handleStatusChange(
                              book,
                              event.target.value
                            )
                          }
                          className="h-9 w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 pr-8 text-xs font-semibold text-gray-700 outline-none transition focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-50 disabled:opacity-60"
                        >
                          {availabilityOptions.map(
                            (option) => (
                              <option
                                key={
                                  option.value
                                }
                                value={
                                  option.value
                                }
                              >
                                {option.label}
                              </option>
                            )
                          )}
                        </select>

                        {statusUpdating ? (
                          <FiRefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />
                        ) : (
                          <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={
                          publishUpdating ||
                          (!book.published &&
                            !canPublish)
                        }
                        onClick={() =>
                          handlePublishChange(
                            book
                          )
                        }
                        className={`h-9 rounded-lg border text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                          book.published
                            ? "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                            : "border-yellow-200 bg-yellow-50 text-yellow-800 hover:bg-yellow-100"
                        }`}
                      >
                        {publishUpdating ? (
                          <span className="inline-flex items-center gap-2">
                            <FiRefreshCw className="animate-spin" />
                            Updating
                          </span>
                        ) : book.published ? (
                          <span className="inline-flex items-center gap-2">
                            <FiEyeOff />
                            Unpublish
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            <FiGlobe />
                            Publish
                          </span>
                        )}
                      </button>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex items-center gap-2 border-t border-gray-100 pt-3 md:border-l md:border-t-0 md:pl-4 md:pt-0">
                      <Link
                        href={`/dashboard/librarian/books/edit/${book._id}`}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
                      >
                        <FiEdit3 />
                        Edit
                      </Link>

                      <Link
                        href={`/books/${book._id}`}
                        target="_blank"
                        title="View book"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50"
                      >
                        <FiArrowUpRight />
                      </Link>

                      <button
                        type="button"
                        title="Delete book"
                        onClick={() =>
                          setDeleteBook(
                            book
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* DELETE MODAL */}

      {deleteBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
            <div className="p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <FiTrash2 />
              </div>

              <h2 className="text-lg font-bold text-gray-900">
                Delete book?
              </h2>

              <p className="mt-2 text-sm leading-5 text-gray-500">
                This will permanently remove{" "}
                <span className="font-semibold text-gray-800">
                  {deleteBook.title ||
                    "this book"}
                </span>
                .
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50 p-4">
              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setDeleteBook(null)
                }
                className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-xs font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-red-600 px-4 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <FiRefreshCw className="animate-spin" />
                    Deleting
                  </>
                ) : (
                  <>
                    <FiTrash2 />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}

      {toast && (
        <div className="fixed bottom-5 right-5 z-[60] max-w-sm">
          <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-lg">
            <FiCheckCircle className="shrink-0 text-emerald-500" />

            <span>{toast}</span>

            <button
              type="button"
              onClick={() => setToast("")}
              className="ml-1 text-gray-400 hover:text-gray-700"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
