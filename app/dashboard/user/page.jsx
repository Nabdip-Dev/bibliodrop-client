"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  FiArrowUpRight,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiMessageSquare,
  FiRefreshCw,
  FiSearch,
  FiSettings,
  FiStar,
  FiTruck,
  FiUser,
  FiX,
} from "react-icons/fi";

import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export default function UserDashboard() {
  const [user, setUser] = useState(null);

  const [deliveries, setDeliveries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const [reviewModal, setReviewModal] =
    useState(false);

  const [selectedDelivery, setSelectedDelivery] =
    useState(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] =
    useState(false);

  const [search, setSearch] = useState("");

  // =========================================================
  // LOAD DASHBOARD DATA
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);

        const { data: session } =
          await authClient.getSession();

        if (!session?.user) {
          if (mounted) {
            setLoading(false);
          }

          return;
        }

        const currentUser = session.user;

        if (mounted) {
          setUser(currentUser);
        }

        const userId = currentUser.id;

        const [
          deliveryResponse,
          reviewResponse,
          transactionResponse,
        ] = await Promise.all([
          fetch(
            `${API_URL}/deliveries?userId=${encodeURIComponent(
              userId
            )}`,
            {
              cache: "no-store",
            }
          ),

          fetch(
            `${API_URL}/reviews?userId=${encodeURIComponent(
              userId
            )}`,
            {
              cache: "no-store",
            }
          ),

          fetch(
            `${API_URL}/transactions?userId=${encodeURIComponent(
              userId
            )}`,
            {
              cache: "no-store",
            }
          ),
        ]);

        const deliveryData =
          deliveryResponse.ok
            ? await deliveryResponse.json()
            : [];

        const reviewData =
          reviewResponse.ok
            ? await reviewResponse.json()
            : [];

        const transactionData =
          transactionResponse.ok
            ? await transactionResponse.json()
            : [];

        if (!mounted) return;

        setDeliveries(
          Array.isArray(deliveryData)
            ? deliveryData
            : []
        );

        setReviews(
          Array.isArray(reviewData)
            ? reviewData
            : []
        );

        setTransactions(
          Array.isArray(transactionData)
            ? transactionData
            : []
        );
      } catch (error) {
        console.error(
          "USER DASHBOARD ERROR:",
          error
        );

        if (mounted) {
          setToast(
            "Failed to load dashboard data"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================================================
  // TOAST
  // =========================================================

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [toast]);

  // =========================================================
  // STATS
  // =========================================================

  const pendingCount = useMemo(() => {
    return deliveries.filter(
      (item) =>
        item.status === "Pending" ||
        item.status === "Approved" ||
        item.status === "Out for Delivery"
    ).length;
  }, [deliveries]);

  const deliveredCount = useMemo(() => {
    return deliveries.filter(
      (item) =>
        item.status === "Delivered" ||
        item.status === "Completed"
    ).length;
  }, [deliveries]);

  const progressCount = useMemo(() => {
    return deliveries.filter(
      (item) =>
        item.status === "Approved" ||
        item.status === "Out for Delivery"
    ).length;
  }, [deliveries]);

  const totalSpent = useMemo(() => {
    return transactions.reduce(
      (total, item) =>
        total + Number(item.amount || 0),
      0
    );
  }, [transactions]);

  // =========================================================
  // FILTER
  // =========================================================

  const filteredDeliveries = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return deliveries;
    }

    return deliveries.filter((delivery) => {
      const title =
        delivery.bookTitle || "";

      const status =
        delivery.status || "";

      const id =
        delivery._id || "";

      return (
        title
          .toLowerCase()
          .includes(value) ||
        status
          .toLowerCase()
          .includes(value) ||
        String(id)
          .toLowerCase()
          .includes(value)
      );
    });
  }, [deliveries, search]);

  // =========================================================
  // REVIEW CHECK
  // =========================================================

  const hasReview = (deliveryId) => {
    return reviews.some(
      (review) =>
        String(review.deliveryId) ===
        String(deliveryId)
    );
  };

  // =========================================================
  // OPEN REVIEW
  // =========================================================

  const openReview = (delivery) => {
    setSelectedDelivery(delivery);
    setRating(5);
    setComment("");
    setReviewModal(true);
  };

  // =========================================================
  // SUBMIT REVIEW
  // =========================================================

  const submitReview = async () => {
    if (!selectedDelivery) return;

    if (!comment.trim()) {
      setToast("Please write your review");
      return;
    }

    try {
      setReviewLoading(true);

      const { data: session } =
        await authClient.getSession();

      if (!session?.user) {
        setToast("Please login first");
        return;
      }

      const response = await fetch(
        `${API_URL}/reviews`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            userId: session.user.id,

            deliveryId:
              selectedDelivery._id,

            bookId:
              selectedDelivery.bookId,

            rating,

            comment:
              comment.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to submit review"
        );
      }

      setReviews((current) => [
        data.review,
        ...current,
      ]);

      setReviewModal(false);
      setSelectedDelivery(null);
      setComment("");
      setRating(5);

      setToast(
        "Review submitted successfully"
      );
    } catch (error) {
      console.error(
        "REVIEW ERROR:",
        error
      );

      setToast(
        error.message ||
        "Failed to submit review"
      );
    } finally {
      setReviewLoading(false);
    }
  };

  // =========================================================
  // USER NAME
  // =========================================================

  const userName =
    user?.name ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Reader";

  const firstName =
    userName.split(" ")[0];

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="min-h-full bg-[#fafaf8]">
      <div className="mx-auto w-full max-w-[1380px] px-3 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-6">

        {/* =====================================================
            SEARCH
        ====================================================== */}

        <div className="mb-5">
          <div className="relative max-w-xl">
            <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search your deliveries..."
              className="h-10 w-full rounded-xl border border-black/[0.07] bg-white pl-10 pr-4 text-[11px] font-medium text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/[0.04]"
            />
          </div>
        </div>

        {/* =====================================================
            DASHBOARD HEADER
        ====================================================== */}

        <section className="mb-5 flex flex-col justify-between gap-4 rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm sm:p-5 md:flex-row md:items-center">

          <div className="flex items-center gap-3">

            {/* Avatar */}

            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black text-sm font-black text-white">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              ) : (
                userName
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#fc1d15]">
                My Library
              </p>

              <h1 className="mt-0.5 text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
                Welcome back,{" "}
                <span className="text-[#fc1d15]">
                  {firstName}
                </span>
              </h1>

              <p className="mt-1 text-[10px] text-gray-400 sm:text-[11px]">
                Manage your books, deliveries and reading activity.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">

            <Link
              href="/profile"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3 text-[9px] font-black text-gray-800 transition hover:border-black hover:bg-black hover:text-white"
            >
              <FiUser className="h-3.5 w-3.5" />
              Profile
            </Link>

            <Link
              href="/browse-books"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-black px-3.5 text-[9px] font-black text-white shadow-[2px_2px_0_#fcc615] transition hover:bg-[#fc1d15] hover:shadow-[2px_2px_0_#000]"
            >
              <FiSearch className="h-3.5 w-3.5" />
              Browse Books
              <FiArrowUpRight className="h-3 w-3" />
            </Link>

          </div>
        </section>

        {/* =====================================================
            STAT CARDS
        ====================================================== */}

        <section className="mb-5 grid grid-cols-2 gap-2.5 md:grid-cols-4">

          <DashboardStat
            icon={<FiTruck />}
            label="Deliveries"
            value={
              loading
                ? "—"
                : deliveries.length
            }
            color="red"
          />

          <DashboardStat
            icon={<FiClock />}
            label="In Progress"
            value={
              loading
                ? "—"
                : progressCount
            }
            color="yellow"
          />

          <DashboardStat
            icon={<FiCheckCircle />}
            label="Delivered"
            value={
              loading
                ? "—"
                : deliveredCount
            }
            color="green"
          />

          <DashboardStat
            icon={<FiStar />}
            label="Reviews"
            value={
              loading
                ? "—"
                : reviews.length
            }
            color="blue"
          />

        </section>

        {/* =====================================================
            MAIN TWO COLUMN AREA
        ====================================================== */}

        <section className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">

          {/* ===================================================
              RECENT DELIVERIES
          ==================================================== */}

          <div className="min-w-0 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-3.5">

              <div>
                <h2 className="text-sm font-black text-gray-900">
                  Recent Deliveries
                </h2>

                <p className="mt-0.5 text-[9px] text-gray-400">
                  Track your recent book requests
                </p>
              </div>

              <span className="rounded-full bg-[#fff1ef] px-2.5 py-1 text-[8px] font-black text-[#fc1d15]">
                {deliveries.length} Total
              </span>

            </div>

            <div className="p-3">

              {loading ? (
                <DeliverySkeleton />
              ) : filteredDeliveries.length ===
                0 ? (
                <EmptyDeliveries
                  searching={Boolean(
                    search.trim()
                  )}
                />
              ) : (
                <div className="space-y-2">

                  {filteredDeliveries
                    .slice(0, 7)
                    .map(
                      (
                        delivery,
                        index
                      ) => (
                        <DeliveryRow
                          key={
                            delivery._id
                          }
                          delivery={
                            delivery
                          }
                          index={
                            index
                          }
                          reviewed={hasReview(
                            delivery._id
                          )}
                          onReview={() =>
                            openReview(
                              delivery
                            )
                          }
                        />
                      )
                    )}

                </div>
              )}

            </div>

            {deliveries.length > 7 && (
              <div className="border-t border-black/[0.06] px-4 py-3">

                <Link
                  href="/my-deliveries"
                  className="inline-flex items-center gap-1 text-[9px] font-black text-gray-500 transition hover:text-[#fc1d15]"
                >
                  View all deliveries
                  <FiArrowUpRight className="h-3 w-3" />
                </Link>

              </div>
            )}

          </div>

          {/* ===================================================
              RIGHT SIDE
          ==================================================== */}

          <aside className="space-y-4">

            {/* Quick Access */}

            <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5 shadow-sm">

              <div className="mb-3">
                <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#fc1d15]">
                  Shortcuts
                </p>

                <h2 className="mt-0.5 text-sm font-black text-gray-900">
                  Quick Access
                </h2>
              </div>

              <div className="space-y-1.5">

                <QuickAccess
                  href="/browse-books"
                  icon={<FiSearch />}
                  title="Browse Books"
                  text="Find your next book"
                  color="red"
                />

                <QuickAccess
                  href="/transactions"
                  icon={<FiCreditCard />}
                  title="Transactions"
                  text={`${transactions.length} payment records`}
                  color="yellow"
                />

                <QuickAccess
                  href="/my-reviews"
                  icon={<FiMessageSquare />}
                  title="My Reviews"
                  text={`${reviews.length} reviews submitted`}
                  color="blue"
                />

                <QuickAccess
                  href="/profile"
                  icon={<FiUser />}
                  title="My Profile"
                  text="Manage your account"
                  color="green"
                />

                <QuickAccess
                  href="/settings"
                  icon={<FiSettings />}
                  title="Settings"
                  text="Account preferences"
                  color="gray"
                />

              </div>
            </div>

            {/* Spending */}

            <div className="rounded-2xl bg-black p-4 text-white shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#fcc615]">
                    Activity
                  </p>

                  <p className="mt-1 text-xs font-bold text-gray-300">
                    Total spent
                  </p>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <FiCreditCard className="h-3.5 w-3.5 text-[#fcc615]" />
                </div>

              </div>

              <p className="mt-3 text-xl font-black">
                ₹
                {totalSpent.toLocaleString(
                  "en-IN"
                )}
              </p>

              <p className="mt-1 text-[8px] text-gray-500">
                Across your book deliveries
              </p>

            </div>

          </aside>

        </section>

        {/* =====================================================
            BOTTOM INFO
        ====================================================== */}

        <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

          <BottomInfo
            icon={<FiBookOpen />}
            title="Reading Activity"
            value={`${deliveredCount} books delivered`}
            color="red"
          />

          <BottomInfo
            icon={<FiTruck />}
            title="Current Status"
            value={
              pendingCount
                ? `${pendingCount} active delivery`
                : "No active delivery"
            }
            color="yellow"
          />

          <BottomInfo
            icon={<FiStar />}
            title="Your Reviews"
            value={`${reviews.length} submitted`}
            color="blue"
          />

        </section>

      </div>

      {/* =======================================================
          REVIEW MODAL
      ======================================================== */}

      {reviewModal &&
        selectedDelivery && (
          <ReviewModal
            delivery={selectedDelivery}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            loading={reviewLoading}
            onClose={() =>
              setReviewModal(false)
            }
            onSubmit={submitReview}
          />
        )}

      {/* =======================================================
          TOAST
      ======================================================== */}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[500] w-[calc(100%-24px)] max-w-sm -translate-x-1/2">

          <div className="flex items-center gap-2.5 rounded-xl bg-black px-3.5 py-3 text-white shadow-2xl">

            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fcc615] text-black">
              <FiRefreshCw className="h-3.5 w-3.5" />
            </div>

            <p className="text-[10px] font-semibold">
              {toast}
            </p>

            <button
              type="button"
              onClick={() =>
                setToast("")
              }
              className="ml-auto text-gray-400 hover:text-white"
            >
              ×
            </button>

          </div>

        </div>
      )}
    </main>
  );
}

// =============================================================
// STAT
// =============================================================

function DashboardStat({
  icon,
  label,
  value,
  color,
}) {
  const colors = {
    red: {
      bg: "bg-[#fff0ef]",
      text: "text-[#fc1d15]",
    },

    yellow: {
      bg: "bg-[#fff7d6]",
      text: "text-[#9b7900]",
    },

    green: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },

    blue: {
      bg: "bg-blue-50",
      text: "text-blue-500",
    },
  };

  const style =
    colors[color] || colors.red;

  return (
    <div className="rounded-xl border border-black/[0.06] bg-white px-3 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-center justify-between gap-2">

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${style.bg} ${style.text}`}
        >
          <span className="text-sm">
            {icon}
          </span>
        </div>

        <span className="text-lg font-black tracking-tight text-gray-900">
          {value}
        </span>

      </div>

      <p className="mt-2 text-[8px] font-black uppercase tracking-wide text-gray-400">
        {label}
      </p>

    </div>
  );
}

// =============================================================
// DELIVERY ROW
// =============================================================

function DeliveryRow({
  delivery,
  index,
  reviewed,
  onReview,
}) {
  const status =
    delivery.status || "Pending";

  const delivered =
    status === "Delivered" ||
    status === "Completed";

  const active =
    status === "Approved" ||
    status === "Out for Delivery";

  const statusStyle = delivered
    ? "bg-emerald-50 text-emerald-600"
    : active
      ? "bg-blue-50 text-blue-500"
      : status === "Cancelled"
        ? "bg-gray-100 text-gray-500"
        : "bg-[#fff7d6] text-[#927200]";

  return (
    <div
      className="group flex min-w-0 items-center gap-2.5 rounded-xl border border-black/[0.05] bg-[#fffdfa] p-2.5 transition hover:border-black/[0.1] hover:bg-white hover:shadow-sm"
      style={{
        animation: `dashboardRow .35s ease-out ${index * 50
          }ms both`,
      }}
    >

      {/* Book Image */}

      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black">

        {delivery.coverImage ? (
          <img
            src={
              delivery.coverImage
            }
            alt={
              delivery.bookTitle ||
              "Book"
            }
            className="h-full w-full object-cover"
          />
        ) : (
          <FiBookOpen className="h-4 w-4 text-white" />
        )}

      </div>

      {/* Info */}

      <div className="min-w-0 flex-1">

        <h3 className="truncate text-[10px] font-black text-gray-900">
          {delivery.bookTitle ||
            "Book Delivery"}
        </h3>

        <p className="mt-0.5 truncate text-[8px] text-gray-400">
          #{String(
            delivery._id || ""
          ).slice(-8)}
          {" • "}
          Qty {delivery.quantity || 1}
        </p>

      </div>

      {/* Status */}

      <span
        className={`hidden shrink-0 rounded-full px-2 py-1 text-[7px] font-black sm:inline-flex ${statusStyle}`}
      >
        {status}
      </span>

      {/* Review */}

      {delivered && !reviewed && (
        <button
          type="button"
          onClick={onReview}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-black px-2 py-1.5 text-[7px] font-black text-white transition hover:bg-[#fc1d15]"
        >
          <FiStar className="h-2.5 w-2.5" />
          Review
        </button>
      )}

      {delivered && reviewed && (
        <span className="hidden items-center gap-1 rounded-lg bg-blue-50 px-2 py-1.5 text-[7px] font-black text-blue-500 sm:inline-flex">
          <FiCheckCircle className="h-2.5 w-2.5" />
          Reviewed
        </span>
      )}

      {!delivered &&
        status !== "Cancelled" && (
          <FiArrowUpRight className="h-3.5 w-3.5 shrink-0 text-gray-300 transition group-hover:text-[#fc1d15]" />
        )}

    </div>
  );
}

// =============================================================
// QUICK ACCESS
// =============================================================

function QuickAccess({
  href,
  icon,
  title,
  text,
  color,
}) {
  const styles = {
    red: {
      bg: "bg-[#fff0ef]",
      icon: "text-[#fc1d15]",
    },

    yellow: {
      bg: "bg-[#fff7d6]",
      icon: "text-[#987600]",
    },

    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-500",
    },

    green: {
      bg: "bg-emerald-50",
      icon: "text-emerald-600",
    },

    gray: {
      bg: "bg-gray-100",
      icon: "text-gray-600",
    },
  };

  const style =
    styles[color] || styles.gray;

  return (
    <Link
      href={href}
      className="group flex items-center gap-2.5 rounded-xl border border-transparent p-2 transition hover:border-black/[0.06] hover:bg-[#fafaf8]"
    >

      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.bg} ${style.icon}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <h3 className="text-[9px] font-black text-gray-900">
          {title}
        </h3>

        <p className="mt-0.5 truncate text-[7px] text-gray-400">
          {text}
        </p>

      </div>

      <FiArrowUpRight className="h-3 w-3 shrink-0 text-gray-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#fc1d15]" />

    </Link>
  );
}

// =============================================================
// BOTTOM INFO
// =============================================================

function BottomInfo({
  icon,
  title,
  value,
  color,
}) {
  const styles = {
    red: "bg-[#fff0ef] text-[#fc1d15]",
    yellow:
      "bg-[#fff7d6] text-[#987600]",
    blue: "bg-blue-50 text-blue-500",
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white p-3 shadow-sm">

      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${styles[color]
          }`}
      >
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[8px] font-black uppercase tracking-wide text-gray-400">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[10px] font-black text-gray-900">
          {value}
        </p>

      </div>

    </div>
  );
}

// =============================================================
// EMPTY
// =============================================================

function EmptyDeliveries({
  searching,
}) {
  return (
    <div className="rounded-xl border border-dashed border-black/10 bg-[#fffdfa] px-4 py-10 text-center">

      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
        {searching ? (
          <FiSearch className="h-4 w-4" />
        ) : (
          <FiBookOpen className="h-4 w-4" />
        )}
      </div>

      <h3 className="mt-3 text-xs font-black text-gray-900">
        {searching
          ? "No delivery found"
          : "No deliveries yet"}
      </h3>

      <p className="mx-auto mt-1 max-w-xs text-[9px] leading-4 text-gray-400">
        {searching
          ? "Try another search keyword."
          : "Browse the library and request your first book."}
      </p>

      {!searching && (
        <Link
          href="/browse-books"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#fc1d15] px-3 py-2 text-[8px] font-black text-white hover:bg-black"
        >
          <FiSearch className="h-3 w-3" />
          Browse Books
        </Link>
      )}

    </div>
  );
}

// =============================================================
// SKELETON
// =============================================================

function DeliverySkeleton() {
  return (
    <div className="space-y-2">

      {[1, 2, 3, 4].map(
        (item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-xl border border-black/[0.05] p-2.5"
          >

            <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-100" />

            <div className="flex-1 space-y-2">
              <div className="h-2.5 w-32 animate-pulse rounded bg-gray-100" />
              <div className="h-2 w-20 animate-pulse rounded bg-gray-100" />
            </div>

            <div className="h-6 w-14 animate-pulse rounded-full bg-gray-100" />

          </div>
        )
      )}

    </div>
  );
}

// =============================================================
// REVIEW MODAL
// =============================================================

function ReviewModal({
  delivery,
  rating,
  setRating,
  comment,
  setComment,
  loading,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">

      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-3.5">

          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#fc1d15]">
              Your Review
            </p>

            <h2 className="mt-0.5 text-sm font-black text-gray-900">
              Review Book
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-black hover:text-white"
          >
            <FiX className="h-3.5 w-3.5" />
          </button>

        </div>

        {/* Body */}

        <div className="p-4">

          <div className="rounded-xl bg-[#fafaf8] p-3">

            <p className="text-[7px] font-black uppercase tracking-wider text-gray-400">
              Book
            </p>

            <p className="mt-1 text-xs font-black text-gray-900">
              {delivery.bookTitle ||
                "Book Delivery"}
            </p>

          </div>

          {/* Rating */}

          <div className="mt-4">

            <p className="text-[8px] font-black uppercase tracking-wider text-gray-500">
              Rating
            </p>

            <div className="mt-2 flex items-center gap-0.5">

              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setRating(
                        star
                      )
                    }
                    className="p-1"
                  >
                    <FiStar
                      className={`h-5 w-5 ${star <= rating
                          ? "fill-[#fcc615] text-[#fcc615]"
                          : "text-gray-300"
                        }`}
                    />
                  </button>
                )
              )}

              <span className="ml-2 text-[9px] font-bold text-gray-400">
                {rating}/5
              </span>

            </div>

          </div>

          {/* Comment */}

          <div className="mt-4">

            <label className="text-[8px] font-black uppercase tracking-wider text-gray-500">
              Your Review
            </label>

            <textarea
              value={comment}
              onChange={(event) =>
                setComment(
                  event.target.value
                )
              }
              rows={4}
              placeholder="Write your experience with this book..."
              className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-[10px] outline-none focus:border-black focus:ring-1 focus:ring-black"
            />

          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onSubmit}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-[9px] font-black text-white hover:bg-[#fc1d15] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiMessageSquare className="h-3.5 w-3.5" />

            {loading
              ? "Submitting..."
              : "Submit Review"}
          </button>

        </div>

      </div>

    </div>
  );
}
