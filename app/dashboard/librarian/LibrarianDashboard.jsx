"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiPlus,
  FiArrowRight,
  FiPackage,
  FiAlertCircle,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

const API_URL = "http://localhost:5000";

export default function LibrarianDashboard() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [books, setBooks] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const librarianId = session?.user?.id;

  useEffect(() => {
    if (sessionLoading) return;

    if (!librarianId) {
      setLoading(false);
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [booksResponse, deliveriesResponse] =
          await Promise.all([
            fetch(
              `${API_URL}/books?librarianId=${encodeURIComponent(
                librarianId
              )}&page=1&limit=12`,
              {
                cache: "no-store",
              }
            ),
            fetch(
              `${API_URL}/deliveries?librarianId=${encodeURIComponent(
                librarianId
              )}`,
              {
                cache: "no-store",
              }
            ),
          ]);

        if (!booksResponse.ok) {
          throw new Error("Failed to load books");
        }

        if (!deliveriesResponse.ok) {
          throw new Error("Failed to load deliveries");
        }

        const booksData = await booksResponse.json();
        const deliveriesData = await deliveriesResponse.json();

        setBooks(
          Array.isArray(booksData?.books)
            ? booksData.books
            : []
        );

        setDeliveries(
          Array.isArray(deliveriesData)
            ? deliveriesData
            : []
        );
      } catch (err) {
        console.error("LIBRARIAN DASHBOARD ERROR:", err);
        setError(
          err?.message ||
            "Failed to load librarian dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [librarianId, sessionLoading]);

  // =========================================================
  // REAL MONGODB STATS
  // =========================================================

  const stats = useMemo(() => {
    const totalBooks = books.length;

    const availableBooks = books.filter(
      (book) => book.status === "available"
    ).length;

    const checkedOutBooks = books.filter(
      (book) => book.status === "checked_out"
    ).length;

    const unavailableBooks = books.filter(
      (book) => book.status === "unavailable"
    ).length;

    const pendingRequests = deliveries.filter(
      (delivery) =>
        delivery.status === "Pending"
    ).length;

    const approvedRequests = deliveries.filter(
      (delivery) =>
        delivery.status === "Approved"
    ).length;

    const outForDelivery = deliveries.filter(
      (delivery) =>
        delivery.status === "Out for Delivery"
    ).length;

    const delivered = deliveries.filter(
      (delivery) =>
        delivery.status === "Delivered"
    ).length;

    const cancelled = deliveries.filter(
      (delivery) =>
        delivery.status === "Cancelled"
    ).length;

    const activeDeliveries = deliveries.filter(
      (delivery) =>
        delivery.status === "Approved" ||
        delivery.status === "Out for Delivery"
    ).length;

    return {
      totalBooks,
      availableBooks,
      checkedOutBooks,
      unavailableBooks,
      pendingRequests,
      approvedRequests,
      outForDelivery,
      delivered,
      cancelled,
      activeDeliveries,
      totalDeliveries: deliveries.length,
    };
  }, [books, deliveries]);

  // =========================================================
  // RECENT DATA
  // =========================================================

  const recentBooks = useMemo(() => {
    return [...books]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 5);
  }, [books]);

  const recentDeliveries = useMemo(() => {
    return [...deliveries]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 5);
  }, [deliveries]);

  // =========================================================
  // HELPERS
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getBookStatus = (status) => {
    if (status === "available") {
      return {
        label: "Available",
        className:
          "bg-emerald-50 text-emerald-600 border-emerald-100",
      };
    }

    if (status === "checked_out") {
      return {
        label: "Checked Out",
        className:
          "bg-orange-50 text-orange-600 border-orange-100",
      };
    }

    if (status === "unavailable") {
      return {
        label: "Unavailable",
        className:
          "bg-red-50 text-red-600 border-red-100",
      };
    }

    return {
      label: status || "Unknown",
      className:
        "bg-gray-50 text-gray-500 border-gray-100",
    };
  };

  const getDeliveryStatus = (status) => {
    switch (status) {
      case "Pending":
        return {
          className:
            "bg-yellow-50 text-yellow-600 border-yellow-100",
        };

      case "Approved":
        return {
          className:
            "bg-blue-50 text-blue-600 border-blue-100",
        };

      case "Out for Delivery":
        return {
          className:
            "bg-purple-50 text-purple-600 border-purple-100",
        };

      case "Delivered":
        return {
          className:
            "bg-emerald-50 text-emerald-600 border-emerald-100",
        };

      case "Cancelled":
        return {
          className:
            "bg-red-50 text-red-600 border-red-100",
        };

      default:
        return {
          className:
            "bg-gray-50 text-gray-500 border-gray-100",
        };
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (sessionLoading || loading) {
    return (
      <div className="min-h-full bg-[#f8f8f6] p-5 sm:p-7 lg:p-8">
        <div className="mx-auto max-w-[1400px] animate-pulse">
          <div className="h-8 w-52 rounded-lg bg-gray-200" />
          <div className="mt-2 h-4 w-80 rounded bg-gray-200" />

          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 rounded-2xl bg-white border border-gray-100"
              />
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="h-80 rounded-2xl bg-white border border-gray-100" />
            <div className="h-80 rounded-2xl bg-white border border-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // NO SESSION
  // =========================================================

  if (!librarianId) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#f8f8f6] p-6">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <FiAlertCircle className="mx-auto h-10 w-10 text-red-500" />

          <h2 className="mt-4 text-xl font-bold text-black">
            Login Required
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Please login to access the librarian dashboard.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500"
          >
            Go to Login
            <FiArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="min-h-full bg-[#f8f8f6] p-6">
        <div className="mx-auto max-w-[1400px]">
          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
            <FiAlertCircle className="mx-auto h-10 w-10 text-red-500" />

            <h2 className="mt-4 text-xl font-bold text-black">
              Failed to Load Dashboard
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white hover:bg-red-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <div className="min-h-full bg-[#f8f8f6] p-5 sm:p-7 lg:p-8">
      <div className="mx-auto max-w-[1400px]">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
              Librarian Dashboard
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-black sm:text-3xl">
              Library Activity
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your books, requests and deliveries.
            </p>
          </div>

          <Link
            href="/dashboard/librarian/add-book"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-black px-4 py-3 text-xs font-bold text-white shadow-[3px_3px_0_#facc15] transition hover:bg-red-500"
          >
            <FiPlus className="h-4 w-4" />
            Add New Book
          </Link>
        </div>

        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">

          {/* TOTAL BOOKS */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                <FiBookOpen className="h-4 w-4" />
              </div>

              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-300">
                Inventory
              </span>
            </div>

            <p className="mt-5 text-2xl font-black text-black">
              {stats.totalBooks}
            </p>

            <p className="mt-1 text-xs font-semibold text-gray-500">
              Total Books
            </p>
          </div>

          {/* AVAILABLE */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
                <FiCheckCircle className="h-4 w-4" />
              </div>

              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-300">
                Current
              </span>
            </div>

            <p className="mt-5 text-2xl font-black text-black">
              {stats.availableBooks}
            </p>

            <p className="mt-1 text-xs font-semibold text-gray-500">
              Available Books
            </p>
          </div>

          {/* PENDING */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500 text-white">
                <FiClock className="h-4 w-4" />
              </div>

              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-300">
                Requests
              </span>
            </div>

            <p className="mt-5 text-2xl font-black text-black">
              {stats.pendingRequests}
            </p>

            <p className="mt-1 text-xs font-semibold text-gray-500">
              Pending Requests
            </p>
          </div>

          {/* ACTIVE DELIVERY */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white">
                <FiTruck className="h-4 w-4" />
              </div>

              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-300">
                Delivery
              </span>
            </div>

            <p className="mt-5 text-2xl font-black text-black">
              {stats.activeDeliveries}
            </p>

            <p className="mt-1 text-xs font-semibold text-gray-500">
              Active Deliveries
            </p>
          </div>
        </div>

        {/* =====================================================
            ACTIVITY SUMMARY
        ===================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* LIBRARY STATUS */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  Overview
                </p>

                <h2 className="mt-1 text-base font-black text-black">
                  Library Status
                </h2>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
                <FiPackage className="h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="mt-5 space-y-3">

              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-3">
                <span className="text-xs font-semibold text-gray-500">
                  Available Books
                </span>

                <span className="text-sm font-black text-emerald-600">
                  {stats.availableBooks}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-3">
                <span className="text-xs font-semibold text-gray-500">
                  Checked Out
                </span>

                <span className="text-sm font-black text-orange-600">
                  {stats.checkedOutBooks}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-3">
                <span className="text-xs font-semibold text-gray-500">
                  Unavailable
                </span>

                <span className="text-sm font-black text-red-600">
                  {stats.unavailableBooks}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-3">
                <span className="text-xs font-semibold text-gray-500">
                  Total Inventory
                </span>

                <span className="text-sm font-black text-black">
                  {stats.totalBooks}
                </span>
              </div>
            </div>
          </div>

          {/* DELIVERY SUMMARY */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  Delivery
                </p>

                <h2 className="mt-1 text-base font-black text-black">
                  Request Summary
                </h2>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
                <FiTruck className="h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">

              <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-3">
                <p className="text-[10px] font-bold text-yellow-600">
                  Pending
                </p>

                <p className="mt-1 text-xl font-black text-yellow-700">
                  {stats.pendingRequests}
                </p>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                <p className="text-[10px] font-bold text-blue-600">
                  Approved
                </p>

                <p className="mt-1 text-xl font-black text-blue-700">
                  {stats.approvedRequests}
                </p>
              </div>

              <div className="rounded-xl border border-purple-100 bg-purple-50 p-3">
                <p className="text-[10px] font-bold text-purple-600">
                  Out for Delivery
                </p>

                <p className="mt-1 text-xl font-black text-purple-700">
                  {stats.outForDelivery}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-[10px] font-bold text-emerald-600">
                  Delivered
                </p>

                <p className="mt-1 text-xl font-black text-emerald-700">
                  {stats.delivered}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-3">
              <span className="text-xs font-semibold text-gray-500">
                Total Delivery Records
              </span>

              <span className="text-sm font-black text-black">
                {stats.totalDeliveries}
              </span>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Quick Actions
            </p>

            <h2 className="mt-1 text-base font-black text-black">
              Manage Library
            </h2>

            <div className="mt-5 space-y-2">

              <Link
                href="/dashboard/librarian/add-book"
                className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-3 transition hover:border-red-100 hover:bg-red-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                    <FiPlus className="h-4 w-4 text-gray-500 group-hover:text-red-500" />
                  </div>

                  <span className="text-xs font-bold text-gray-600 group-hover:text-black">
                    Add New Book
                  </span>
                </div>

                <FiArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-red-500" />
              </Link>

              <Link
                href="/dashboard/librarian/books"
                className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-3 transition hover:border-red-100 hover:bg-red-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                    <FiBookOpen className="h-4 w-4 text-gray-500 group-hover:text-red-500" />
                  </div>

                  <span className="text-xs font-bold text-gray-600 group-hover:text-black">
                    Manage Books
                  </span>
                </div>

                <FiArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-red-500" />
              </Link>

              <Link
                href="/dashboard/librarian/deliveries"
                className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-3 transition hover:border-red-100 hover:bg-red-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                    <FiTruck className="h-4 w-4 text-gray-500 group-hover:text-red-500" />
                  </div>

                  <span className="text-xs font-bold text-gray-600 group-hover:text-black">
                    Manage Deliveries
                  </span>
                </div>

                <FiArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-red-500" />
              </Link>
            </div>
          </div>
        </div>

        {/* =====================================================
            RECENT BOOKS + RECENT DELIVERIES
        ===================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* RECENT BOOKS */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  Inventory
                </p>

                <h2 className="mt-1 text-base font-black text-black">
                  Recent Books
                </h2>
              </div>

              <Link
                href="/dashboard/librarian/books"
                className="text-[10px] font-bold text-red-500 hover:text-black"
              >
                View All
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {recentBooks.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <FiBookOpen className="mx-auto h-7 w-7 text-gray-300" />

                  <p className="mt-3 text-xs font-semibold text-gray-400">
                    No books found
                  </p>
                </div>
              ) : (
                recentBooks.map((book) => {
                  const status = getBookStatus(
                    book.status
                  );

                  return (
                    <div
                      key={String(book._id)}
                      className="flex items-center gap-3 px-5 py-4"
                    >
                      <div className="h-11 w-9 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.title || "Book"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <FiBookOpen className="h-4 w-4 text-gray-300" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-black">
                          {book.title || "Untitled Book"}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-gray-400">
                          {book.author || "Unknown Author"}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-flex rounded-full border px-2 py-1 text-[8px] font-bold ${status.className}`}
                        >
                          {status.label}
                        </span>

                        <p className="mt-1 text-[8px] text-gray-400">
                          {formatDate(book.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RECENT DELIVERIES */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  Orders
                </p>

                <h2 className="mt-1 text-base font-black text-black">
                  Recent Deliveries
                </h2>
              </div>

              <Link
                href="/dashboard/librarian/deliveries"
                className="text-[10px] font-bold text-red-500 hover:text-black"
              >
                View All
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {recentDeliveries.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <FiTruck className="mx-auto h-7 w-7 text-gray-300" />

                  <p className="mt-3 text-xs font-semibold text-gray-400">
                    No delivery records found
                  </p>
                </div>
              ) : (
                recentDeliveries.map((delivery) => {
                  const status = getDeliveryStatus(
                    delivery.status
                  );

                  return (
                    <div
                      key={String(delivery._id)}
                      className="flex items-center gap-3 px-5 py-4"
                    >
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {delivery.coverImage ? (
                          <img
                            src={delivery.coverImage}
                            alt={
                              delivery.bookTitle ||
                              "Book"
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <FiPackage className="h-4 w-4 text-gray-300" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-black">
                          {delivery.bookTitle ||
                            "Book Delivery"}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-gray-400">
                          {delivery.userName ||
                            delivery.userEmail ||
                            "Unknown User"}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-flex rounded-full border px-2 py-1 text-[8px] font-bold ${status.className}`}
                        >
                          {delivery.status ||
                            "Unknown"}
                        </span>

                        <p className="mt-1 text-[8px] text-gray-400">
                          {formatDate(
                            delivery.createdAt
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}