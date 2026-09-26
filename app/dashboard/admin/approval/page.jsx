"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiBookOpen,
  FiClock,
  FiUser,
  FiMail,
  FiTag,
  FiTruck,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

const API_URL = "http://localhost:5000";

export default function ApprovalPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // ==================================================
  // FETCH PENDING BOOKS
  // ==================================================

  useEffect(() => {
    let cancelled = false;

    const fetchPendingBooks = async () => {
      try {
        const response = await fetch(
          `${API_URL}/admin/books/pending`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to load pending books"
          );
        }

        const pendingBooks = Array.isArray(data)
          ? data
          : Array.isArray(data?.books)
          ? data.books
          : [];

        if (cancelled) return;

        setBooks(pendingBooks);
        setError("");
      } catch (err) {
        if (cancelled) return;

        console.error(
          "FETCH PENDING BOOKS ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load pending books"
        );

        setBooks([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPendingBooks();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==================================================
  // REFRESH PENDING BOOKS
  // ==================================================

  const refreshPendingBooks = async () => {
    try {
      const response = await fetch(
        `${API_URL}/admin/books/pending`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to refresh pending books"
        );
      }

      const pendingBooks = Array.isArray(data)
        ? data
        : Array.isArray(data?.books)
        ? data.books
        : [];

      setBooks(pendingBooks);
    } catch (err) {
      console.error(
        "REFRESH PENDING BOOKS ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to refresh pending books"
      );
    }
  };

  // ==================================================
  // APPROVE
  // ==================================================

  const handleApprove = async (bookId) => {
    if (!bookId) {
      setError("Book ID is missing.");
      return;
    }

    try {
      setProcessingId(bookId);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_URL}/admin/books/${bookId}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to approve book"
        );
      }

      console.log(
        "APPROVE BOOK RESPONSE:",
        data
      );

      setSuccessMessage(
        `"${data?.book?.title || "Book"}" approved and published successfully.`
      );

      await refreshPendingBooks();
    } catch (err) {
      console.error(
        "APPROVE BOOK ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to approve book"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ==================================================
  // REJECT
  // ==================================================

  const handleReject = async (bookId) => {
    if (!bookId) {
      setError("Book ID is missing.");
      return;
    }

    try {
      setProcessingId(bookId);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_URL}/admin/books/${bookId}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to reject book"
        );
      }

      console.log(
        "REJECT BOOK RESPONSE:",
        data
      );

      setSuccessMessage(
        `"${data?.book?.title || "Book"}" rejected successfully.`
      );

      await refreshPendingBooks();
    } catch (err) {
      console.error(
        "REJECT BOOK ERROR:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to reject book"
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-7">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="border-b border-gray-200 pb-5">
          <Link
            href="/dashboard/admin"
            className="
              inline-flex items-center gap-2
              rounded-lg
              border border-gray-200
              bg-white
              px-3 py-2
              text-xs font-bold
              text-gray-600
              transition
              hover:border-gray-300
              hover:bg-gray-50
              hover:text-black
            "
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
                Approval Queue
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Review books submitted by librarians.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-lg bg-orange-100 px-3 py-2 text-xs font-bold text-orange-700">
              <FiClock size={14} />

              {loading
                ? "Loading..."
                : `${books.length} Pending`}
            </div>
          </div>
        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <FiAlertCircle
              size={17}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-xs font-bold text-red-500 hover:text-red-700"
            >
              Close
            </button>
          </div>
        )}

        {/* ==================================================
            SUCCESS
        ================================================== */}

        {successMessage && (
          <div className="mt-5 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
            <FiCheckCircle
              size={17}
              className="shrink-0 text-green-600"
            />

            <p className="text-sm font-semibold text-green-700">
              {successMessage}
            </p>

            <button
              type="button"
              onClick={() => setSuccessMessage("")}
              className="ml-auto text-xs font-bold text-green-600 hover:text-green-800"
            >
              Close
            </button>
          </div>
        )}

        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-10 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-gray-200 border-t-[#fc1d15]" />

            <p className="mt-3 text-sm font-semibold text-gray-500">
              Loading pending books...
            </p>
          </div>
        )}

        {/* ==================================================
            EMPTY
        ================================================== */}

        {!loading &&
          books.length === 0 &&
          !error && (
            <div className="mt-5 rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-600">
                <FiCheckCircle size={22} />
              </div>

              <h2 className="mt-4 text-base font-extrabold text-black">
                No Pending Books
              </h2>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-gray-500">
                There are no books waiting for approval.
              </p>

              <Link
                href="/dashboard/admin"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-bold text-white transition hover:bg-gray-800"
              >
                <FiArrowLeft size={13} />
                Dashboard
              </Link>
            </div>
          )}

        {/* ==================================================
            BOOK LIST
        ================================================== */}

        {!loading && books.length > 0 && (
          <div className="mt-5 space-y-3">
            {books.map((book) => {
              const isProcessing =
                processingId === book._id;

              return (
                <article
                  key={book._id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                  <div className="flex flex-col gap-4 p-4 sm:flex-row">

                    {/* COVER */}

                    <div className="shrink-0">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={
                            book.title ||
                            "Book cover"
                          }
                          className="h-32 w-[86px] rounded-lg bg-gray-100 object-cover"
                        />
                      ) : (
                        <div className="flex h-32 w-[86px] items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                          <FiBookOpen size={25} />
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">

                      {/* TITLE */}

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h2 className="truncate text-base font-extrabold text-black">
                            {book.title ||
                              "Untitled Book"}
                          </h2>

                          <p className="mt-0.5 text-xs text-gray-500">
                            by{" "}
                            <span className="font-semibold text-gray-700">
                              {book.author ||
                                "Unknown"}
                            </span>
                          </p>
                        </div>

                        <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-md bg-yellow-100 px-2 py-1 text-[10px] font-bold text-yellow-700">
                          <FiClock size={11} />

                          {book.approvalStatus ===
                          "pending"
                            ? "Pending"
                            : book.approvalStatus ||
                              "Pending"}
                        </span>
                      </div>

                      {/* DETAILS */}

                      <div className="mt-4 grid gap-x-5 gap-y-2 border-y border-gray-100 py-3 sm:grid-cols-2 lg:grid-cols-3">
                        <InfoItem
                          icon={FiTag}
                          label="Category"
                          value={
                            book.category ||
                            "N/A"
                          }
                        />

                        <InfoItem
                          icon={FiTruck}
                          label="Delivery Fee"
                          value={`₹${Number(
                            book.deliveryFee || 0
                          )}`}
                        />

                        <InfoItem
                          icon={FiUser}
                          label="Librarian"
                          value={
                            book.librarianName ||
                            "Unknown"
                          }
                        />

                        {book.librarianEmail && (
                          <InfoItem
                            icon={FiMail}
                            label="Email"
                            value={
                              book.librarianEmail
                            }
                          />
                        )}

                        <InfoItem
                          icon={FiCheckCircle}
                          label="Published"
                          value={
                            book.published
                              ? "Yes"
                              : "No"
                          }
                        />

                        <InfoItem
                          icon={FiBookOpen}
                          label="Book Status"
                          value={
                            book.status ||
                            "Available"
                          }
                        />
                      </div>

                      {/* DESCRIPTION */}

                      {book.description && (
                        <div className="mt-3">
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Description
                          </p>

                          <p className="text-xs leading-5 text-gray-500">
                            {book.description}
                          </p>
                        </div>
                      )}

                      {/* ACTIONS */}

                      <div className="mt-4 flex flex-wrap items-center gap-2">

                        {/* APPROVE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleApprove(
                              book._id
                            )
                          }
                          disabled={
                            processingId !== null
                          }
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-lg
                            bg-green-600
                            px-3.5 py-2
                            text-xs
                            font-bold
                            text-white
                            transition
                            hover:bg-green-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          {isProcessing ? (
                            <>
                              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <FiCheck size={14} />
                              Approve & Publish
                            </>
                          )}
                        </button>

                        {/* REJECT */}

                        <button
                          type="button"
                          onClick={() =>
                            handleReject(
                              book._id
                            )
                          }
                          disabled={
                            processingId !== null
                          }
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-lg
                            border
                            border-red-200
                            bg-white
                            px-3.5 py-2
                            text-xs
                            font-bold
                            text-red-600
                            transition
                            hover:bg-red-50
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          {isProcessing ? (
                            <>
                              <span className="h-3 w-3 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <FiXCircle size={14} />
                              Reject
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

// ==================================================
// INFO ITEM
// ==================================================

function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Icon
        size={13}
        className="shrink-0 text-gray-400"
      />

      <div className="min-w-0">
        <span className="text-[10px] text-gray-400">
          {label}
        </span>

        <p className="truncate text-xs font-semibold text-gray-700">
          {value}
        </p>
      </div>
    </div>
  );
}
