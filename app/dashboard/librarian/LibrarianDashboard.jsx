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

        const [booksResponse, deliveriesResponse] = await Promise.all([
          fetch(
            `${API_URL}/books?librarianId=${encodeURIComponent(
              librarianId
            )}&page=1&limit=12`,
            { cache: "no-store" }
          ),
          fetch(
            `${API_URL}/deliveries?librarianId=${encodeURIComponent(
              librarianId
            )}`,
            { cache: "no-store" }
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
          Array.isArray(booksData?.books) ? booksData.books : []
        );

        /*
         * Delivery API normally returns an array.
         * The extra handling below also supports an object response
         * such as { deliveries: [...] } so the dashboard does not
         * silently show zero when the response shape changes.
         */
        let deliveryList = Array.isArray(deliveriesData)
          ? deliveriesData
          : Array.isArray(deliveriesData?.deliveries)
            ? deliveriesData.deliveries
            : [];

        /*
         * Normalize old/variant status values.
         * MongoDB currently uses:
         * Pending, Approved, Out for Delivery, Delivered, Cancelled
         */
        deliveryList = deliveryList.map((delivery) => ({
          ...delivery,
          status: normalizeDeliveryStatus(delivery?.status),
        }));

        setDeliveries(deliveryList);
      } catch (err) {
        console.error("LIBRARIAN DASHBOARD ERROR:", err);
        setError(
          err?.message || "Failed to load librarian dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [librarianId, sessionLoading]);

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
      (delivery) => delivery.status === "Pending"
    ).length;

    const approvedRequests = deliveries.filter(
      (delivery) => delivery.status === "Approved"
    ).length;

    const outForDelivery = deliveries.filter(
      (delivery) => delivery.status === "Out for Delivery"
    ).length;

    const delivered = deliveries.filter(
      (delivery) => delivery.status === "Delivered"
    ).length;

    const cancelled = deliveries.filter(
      (delivery) => delivery.status === "Cancelled"
    ).length;

    const activeDeliveries =
      approvedRequests + outForDelivery;

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

  const recentBooks = useMemo(
    () =>
      [...books]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
        .slice(0, 5),
    [books]
  );

  const recentDeliveries = useMemo(
    () =>
      [...deliveries]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
        .slice(0, 5),
    [deliveries]
  );

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getBookStatus = (status) => {
    const statusMap = {
      available: {
        label: "Available",
        className:
          "bg-emerald-50 text-emerald-600 border-emerald-100",
      },
      checked_out: {
        label: "Checked Out",
        className:
          "bg-orange-50 text-orange-600 border-orange-100",
      },
      unavailable: {
        label: "Unavailable",
        className:
          "bg-red-50 text-red-600 border-red-100",
      },
    };

    return (
      statusMap[status] || {
        label: status || "Unknown",
        className:
          "bg-gray-50 text-gray-500 border-gray-100",
      }
    );
  };

  const getDeliveryStatus = (status) => {
    const statusMap = {
      Pending:
        "bg-yellow-50 text-yellow-600 border-yellow-100",
      Approved:
        "bg-blue-50 text-blue-600 border-blue-100",
      "Out for Delivery":
        "bg-purple-50 text-purple-600 border-purple-100",
      Delivered:
        "bg-emerald-50 text-emerald-600 border-emerald-100",
      Cancelled:
        "bg-red-50 text-red-600 border-red-100",
    };

    return {
      className:
        statusMap[status] ||
        "bg-gray-50 text-gray-500 border-gray-100",
    };
  };

  if (sessionLoading || loading) {
    return (
      <div className="min-h-full bg-[#f8f8f6] p-4 sm:p-6">
        <div className="mx-auto max-w-[1400px] animate-pulse">
          <div className="h-7 w-48 rounded bg-gray-200" />
          <div className="mt-2 h-3 w-72 rounded bg-gray-200" />

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 rounded-xl border border-gray-100 bg-white"
              />
            ))}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-72 rounded-xl border border-gray-100 bg-white"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!librarianId) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#f8f8f6] p-6">
        <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-7 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
            <FiAlertCircle className="h-5 w-5 text-red-500" />
          </div>

          <h2 className="mt-4 text-lg font-black text-black">
            Login Required
          </h2>

          <p className="mt-2 text-xs leading-5 text-gray-500">
            Please login to access the librarian dashboard.
          </p>

          <Link
            href="/login"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-500"
          >
            Go to Login
            <FiArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-[#f8f8f6] p-5">
        <div className="mx-auto max-w-[1400px]">
          <div className="rounded-xl border border-red-100 bg-white p-7 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              <FiAlertCircle className="h-5 w-5 text-red-500" />
            </div>

            <h2 className="mt-4 text-lg font-black text-black">
              Failed to Load Dashboard
            </h2>

            <p className="mt-2 text-xs text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-black px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f8f8f6] p-4 sm:p-6 lg:p-7">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-red-500">
                Librarian Dashboard
              </p>
            </div>

            <h1 className="mt-1.5 text-xl font-black tracking-tight text-black sm:text-2xl">
              Library Activity
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Manage books, requests and deliveries.
            </p>
          </div>

          <Link
            href="/dashboard/librarian/add-book"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-black px-3.5 py-2.5 text-[11px] font-bold text-white shadow-[2px_2px_0_#facc15] transition hover:bg-red-500"
          >
            <FiPlus className="h-3.5 w-3.5" />
            Add New Book
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={<FiBookOpen />}
            iconClass="bg-black text-white"
            label="Total Books"
            value={stats.totalBooks}
            tag="Inventory"
          />

          <StatCard
            icon={<FiCheckCircle />}
            iconClass="bg-emerald-500 text-white"
            label="Available Books"
            value={stats.availableBooks}
            tag="Current"
          />

          <StatCard
            icon={<FiClock />}
            iconClass="bg-yellow-500 text-white"
            label="Pending Requests"
            value={stats.pendingRequests}
            tag="Requests"
          />

          <StatCard
            icon={<FiTruck />}
            iconClass="bg-blue-500 text-white"
            label="Active Deliveries"
            value={stats.activeDeliveries}
            tag="Delivery"
          />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <section className="rounded-xl border border-gray-100 bg-white">
            <SectionHeader
              eyebrow="Overview"
              title="Library Status"
              icon={<FiPackage />}
            />

            <div className="space-y-2.5 p-4">
              <StatusRow
                label="Available Books"
                value={stats.availableBooks}
                valueClass="text-emerald-600"
                dotClass="bg-emerald-500"
              />

              <StatusRow
                label="Checked Out"
                value={stats.checkedOutBooks}
                valueClass="text-orange-600"
                dotClass="bg-orange-500"
              />

              <StatusRow
                label="Unavailable"
                value={stats.unavailableBooks}
                valueClass="text-red-600"
                dotClass="bg-red-500"
              />

              <StatusRow
                label="Total Inventory"
                value={stats.totalBooks}
                valueClass="text-black"
                dotClass="bg-black"
              />
            </div>
          </section>

          <section className="rounded-xl border border-gray-100 bg-white">
            <SectionHeader
              eyebrow="Delivery"
              title="Request Summary"
              icon={<FiTruck />}
            />

            <div className="grid grid-cols-2 gap-2.5 p-4">
              <MiniStat
                label="Pending"
                value={stats.pendingRequests}
                color="yellow"
              />

              <MiniStat
                label="Approved"
                value={stats.approvedRequests}
                color="blue"
              />

              <MiniStat
                label="Out for Delivery"
                value={stats.outForDelivery}
                color="purple"
              />

              <MiniStat
                label="Delivered"
                value={stats.delivered}
                color="emerald"
              />

              <div className="col-span-2 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">
                <span className="text-[10px] font-semibold text-gray-500">
                  Total Delivery Records
                </span>

                <span className="text-sm font-black text-black">
                  {stats.totalDeliveries}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-100 bg-white">
            <div className="border-b border-gray-100 px-4 py-3.5">
              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400">
                Quick Actions
              </p>

              <h2 className="mt-1 text-sm font-black text-black">
                Manage Library
              </h2>
            </div>

            <div className="space-y-2 p-4">
              <ActionLink
                href="/dashboard/librarian/add-book"
                icon={<FiPlus />}
                label="Add New Book"
              />

              <ActionLink
                href="/dashboard/librarian/books"
                icon={<FiBookOpen />}
                label="Manage Books"
              />

              <ActionLink
                href="/dashboard/librarian/deliveries"
                icon={<FiTruck />}
                label="Manage Deliveries"
              />
            </div>
          </section>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="overflow-hidden rounded-xl border border-gray-100 bg-white">
            <ListHeader
              eyebrow="Inventory"
              title="Recent Books"
              href="/dashboard/librarian/books"
            />

            <div className="divide-y divide-gray-100">
              {recentBooks.length === 0 ? (
                <EmptyState
                  icon={<FiBookOpen />}
                  text="No books found"
                />
              ) : (
                recentBooks.map((book) => {
                  const status = getBookStatus(book.status);

                  return (
                    <div
                      key={String(book._id)}
                      className="flex items-center gap-3 px-4 py-3 transition hover:bg-gray-50"
                    >
                      <div className="h-10 w-8 shrink-0 overflow-hidden rounded-md bg-gray-100">
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.title || "Book"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <FiBookOpen className="h-3.5 w-3.5 text-gray-300" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-bold text-black">
                          {book.title || "Untitled Book"}
                        </p>

                        <p className="mt-0.5 truncate text-[9px] text-gray-400">
                          {book.author || "Unknown Author"}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[7px] font-bold ${status.className}`}
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
          </section>

          <section className="overflow-hidden rounded-xl border border-gray-100 bg-white">
            <ListHeader
              eyebrow="Orders"
              title="Recent Deliveries"
              href="/dashboard/librarian/deliveries"
            />

            <div className="divide-y divide-gray-100">
              {recentDeliveries.length === 0 ? (
                <EmptyState
                  icon={<FiTruck />}
                  text="No delivery records found"
                />
              ) : (
                recentDeliveries.map((delivery) => {
                  const status = getDeliveryStatus(
                    delivery.status
                  );

                  return (
                    <div
                      key={String(delivery._id)}
                      className="flex items-center gap-3 px-4 py-3 transition hover:bg-gray-50"
                    >
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-100">
                        {delivery.coverImage ? (
                          <img
                            src={delivery.coverImage}
                            alt={
                              delivery.bookTitle || "Book"
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <FiPackage className="h-3.5 w-3.5 text-gray-300" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-bold text-black">
                          {delivery.bookTitle ||
                            "Book Delivery"}
                        </p>

                        <p className="mt-0.5 truncate text-[9px] text-gray-400">
                          {delivery.userName ||
                            delivery.userEmail ||
                            "Unknown User"}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[7px] font-bold ${status.className}`}
                        >
                          {delivery.status || "Unknown"}
                        </span>

                        <p className="mt-1 text-[8px] text-gray-400">
                          {formatDate(delivery.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function normalizeDeliveryStatus(status) {
  const value = String(status || "")
    .trim()
    .toLowerCase();

  const statusMap = {
    pending: "Pending",
    approved: "Approved",
    "out for delivery": "Out for Delivery",
    delivered: "Delivered",
    completed: "Delivered",
    cancelled: "Cancelled",
    canceled: "Cancelled",
  };

  return statusMap[value] || String(status || "").trim();
}

function StatCard({
  icon,
  iconClass,
  label,
  value,
  tag,
}) {
  return (
    <div className="group rounded-xl border border-gray-100 bg-white p-4 transition hover:border-gray-200">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}
        >
          <span className="text-sm">{icon}</span>
        </div>

        <span className="text-[8px] font-bold uppercase tracking-wider text-gray-300">
          {tag}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-xl font-black leading-none text-black">
            {value}
          </p>

          <p className="mt-1.5 text-[10px] font-semibold text-gray-500">
            {label}
          </p>
        </div>

        <div className="h-1 w-8 rounded-full bg-gray-100 transition group-hover:bg-red-500" />
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  icon,
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
      <div>
        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-sm font-black text-black">
          {title}
        </h2>
      </div>

      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
        <span className="text-sm">{icon}</span>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  value,
  valueClass,
  dotClass,
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotClass}`}
        />

        <span className="text-[10px] font-semibold text-gray-500">
          {label}
        </span>
      </div>

      <span
        className={`text-sm font-black ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}) {
  const colors = {
    yellow:
      "border-yellow-100 bg-yellow-50 text-yellow-600",
    blue:
      "border-blue-100 bg-blue-50 text-blue-600",
    purple:
      "border-purple-100 bg-purple-50 text-purple-600",
    emerald:
      "border-emerald-100 bg-emerald-50 text-emerald-600",
  };

  return (
    <div
      className={`rounded-lg border p-3 ${colors[color]}`}
    >
      <p className="text-[9px] font-bold">{label}</p>

      <p className="mt-1 text-lg font-black">
        {value}
      </p>
    </div>
  );
}

function ActionLink({
  href,
  icon,
  label,
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5 transition hover:border-red-100 hover:bg-red-50"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-50 text-gray-500 transition group-hover:bg-white group-hover:text-red-500">
          <span className="text-xs">{icon}</span>
        </div>

        <span className="text-[10px] font-bold text-gray-600 group-hover:text-black">
          {label}
        </span>
      </div>

      <FiArrowRight className="h-3 w-3 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-red-500" />
    </Link>
  );
}

function ListHeader({
  eyebrow,
  title,
  href,
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
      <div>
        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gray-400">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-sm font-black text-black">
          {title}
        </h2>
      </div>

      <Link
        href={href}
        className="text-[9px] font-bold text-red-500 transition hover:text-black"
      >
        View All
      </Link>
    </div>
  );
}

function EmptyState({
  icon,
  text,
}) {
  return (
    <div className="px-5 py-10 text-center">
      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-300">
        <span className="text-sm">{icon}</span>
      </div>

      <p className="mt-2 text-[10px] font-semibold text-gray-400">
        {text}
      </p>
    </div>
  );
}
