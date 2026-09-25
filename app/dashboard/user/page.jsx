"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import {
  FiBookOpen,
  FiTruck,
  FiClock,
  FiCheckCircle,
  FiStar,
  FiArrowUpRight,
  FiSearch,
  FiBookmark,
  FiMessageSquare,
  FiRefreshCw,
  FiX,
  FiSend,
} from "react-icons/fi";

import { authClient } from "@/lib/auth-client";

export default function UserDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const [reviewModal, setReviewModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] =
    useState(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] =
    useState(false);

  // =========================
  // LOAD DELIVERIES + REVIEWS
  // =========================
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: session } =
          await authClient.getSession();

        if (!session?.user) {
          setLoading(false);
          return;
        }

        const userId = session.user.id;

        const [deliveryResponse, reviewResponse] =
          await Promise.all([
            fetch(
              `http://localhost:5000/deliveries?userId=${userId}`,
              {
                cache: "no-store",
              }
            ),

            fetch(
              `http://localhost:5000/reviews?userId=${userId}`,
              {
                cache: "no-store",
              }
            ),
          ]);

        const deliveryData =
          await deliveryResponse.json();

        const reviewData =
          await reviewResponse.json();

        if (deliveryResponse.ok) {
          setDeliveries(deliveryData);
        }

        if (reviewResponse.ok) {
          setReviews(reviewData);
        }
      } catch (error) {
        console.error(
          "FAILED TO LOAD USER DATA:",
          error
        );

        setToast(
          "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // =========================
  // TOAST
  // =========================
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(
      () => setToast(""),
      2200
    );

    return () => clearTimeout(timer);
  }, [toast]);

  // =========================
  // COUNTS
  // =========================
  const pendingCount = deliveries.filter(
    (delivery) =>
      delivery.status === "Pending"
  ).length;

  const deliveredCount = deliveries.filter(
    (delivery) =>
      delivery.status === "Delivered" ||
      delivery.status === "Completed"
  ).length;

  // =========================
  // OPEN REVIEW MODAL
  // =========================
  const openReviewModal = (delivery) => {
    setSelectedDelivery(delivery);
    setRating(5);
    setComment("");
    setReviewModal(true);
  };

  // =========================
  // SUBMIT REVIEW
  // =========================
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
        "http://localhost:5000/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
            deliveryId: selectedDelivery._id,
            bookId: selectedDelivery.bookId,
            rating,
            comment,
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
        "SUBMIT REVIEW ERROR:",
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

  // =========================
  // CHECK IF REVIEWED
  // =========================
  const hasReview = (deliveryId) => {
    return reviews.some(
      (review) =>
        String(review.deliveryId) ===
        String(deliveryId)
    );
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffdf8] px-3 py-5 sm:px-5">
      {/* Background */}
      <div className="pointer-events-none absolute -left-24 top-10 h-48 w-48 rounded-full bg-[#fc1d15]/[0.04] blur-3xl" />

      <div className="pointer-events-none absolute -right-24 top-0 h-56 w-56 rounded-full bg-[#fcc615]/[0.07] blur-3xl" />

      <div className="relative mx-auto max-w-5xl">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-1 flex items-center gap-1.5">
              <span className="h-1 w-5 rounded-full bg-[#fc1d15]" />

              <span className="text-[8px] font-black uppercase tracking-[0.18em] text-[#fc1d15]">
                My Library
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-black sm:text-3xl">
              User{" "}
              <span className="text-[#fc1d15]">
                Dashboard
              </span>
            </h1>

            <p className="mt-1 text-[11px] text-gray-400">
              Manage your books, deliveries and reading activity.
            </p>
          </div>

          <Link
            href="/browse-books"
            className="group inline-flex w-fit items-center gap-2 rounded-lg bg-black px-3.5 py-2.5 text-[10px] font-black text-white shadow-[3px_3px_0_#fcc615] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fc1d15] hover:shadow-[3px_3px_0_#000]"
          >
            <FiSearch className="h-3.5 w-3.5" />

            Browse Books

            <FiArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatCard
            icon={<FiTruck />}
            label="Total Deliveries"
            value={deliveries.length}
            iconBg="bg-[#fc1d15]/10"
            iconColor="text-[#fc1d15]"
          />

          <StatCard
            icon={<FiClock />}
            label="Pending"
            value={pendingCount}
            iconBg="bg-[#fcc615]/20"
            iconColor="text-[#b28a00]"
          />

          <StatCard
            icon={<FiCheckCircle />}
            label="Delivered"
            value={deliveredCount}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          <StatCard
            icon={<FiStar />}
            label="Reviews"
            value={reviews.length}
            iconBg="bg-blue-50"
            iconColor="text-blue-500"
          />
        </div>

        {/* Delivery History */}
        <section className="mt-5 overflow-hidden rounded-[16px] border border-black/[0.06] bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-black/[0.06] px-3.5 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white">
                <FiTruck className="h-3.5 w-3.5" />
              </div>

              <div>
                <h2 className="text-sm font-black text-gray-900">
                  Delivery History
                </h2>

                <p className="text-[9px] text-gray-400">
                  Your recent book deliveries
                </p>
              </div>
            </div>

            <span className="rounded-full bg-[#fff4f3] px-2.5 py-1 text-[9px] font-bold text-[#fc1d15]">
              {deliveries.length} Total
            </span>
          </div>

          <div className="p-3">
            {loading ? (
              <div className="space-y-2">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-black/[0.05] p-3"
                  >
                    <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-100" />

                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-32 animate-pulse rounded bg-gray-100" />
                      <div className="h-2 w-24 animate-pulse rounded bg-gray-100" />
                    </div>

                    <div className="h-6 w-16 animate-pulse rounded-full bg-gray-100" />
                  </div>
                ))}
              </div>
            ) : deliveries.length === 0 ? (
              <div className="rounded-xl border border-dashed border-black/10 bg-[#fffdf8] px-4 py-8 text-center">

                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
                  <FiBookOpen className="h-5 w-5" />
                </div>

                <h3 className="mt-3 text-sm font-black text-gray-900">
                  No deliveries yet
                </h3>

                <p className="mt-1 text-[10px] text-gray-400">
                  Browse the library and request your first book.
                </p>

                <Link
                  href="/browse-books"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#fc1d15] px-3 py-2 text-[10px] font-bold text-white transition hover:bg-black"
                >
                  <FiSearch className="h-3 w-3" />
                  Browse Books
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {deliveries.map(
                  (delivery, index) => (
                    <DeliveryCard
                      key={delivery._id}
                      delivery={delivery}
                      index={index}
                      reviewed={hasReview(
                        delivery._id
                      )}
                      onReview={() =>
                        openReviewModal(
                          delivery
                        )
                      }
                    />
                  )
                )}
              </div>
            )}
          </div>
        </section>

        {/* Quick Links */}
        <section className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#fc1d15]">
                Explore
              </p>

              <h2 className="text-sm font-black text-gray-900">
                Quick Access
              </h2>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <QuickLink
              href="/browse-books"
              icon={<FiSearch />}
              title="Browse Books"
              text="Find your next book."
              iconBg="bg-[#fc1d15]/10"
              iconColor="text-[#fc1d15]"
            />

            <QuickLink
              icon={<FiBookmark />}
              title="Reading List"
              text="View books you want to read."
              iconBg="bg-[#fcc615]/20"
              iconColor="text-[#b28a00]"
              onClick={() =>
                setToast(
                  "Reading List coming soon"
                )
              }
            />

            <QuickLink
              icon={<FiMessageSquare />}
              title="My Reviews"
              text={`${reviews.length} reviews submitted.`}
              iconBg="bg-blue-50"
              iconColor="text-blue-500"
              onClick={() =>
                setToast(
                  reviews.length
                    ? `${reviews.length} review(s) submitted`
                    : "No reviews yet"
                )
              }
            />
          </div>
        </section>

        {/* Bottom strip */}
        <div className="mt-5 flex items-center justify-between overflow-hidden rounded-[14px] bg-black px-3.5 py-3 text-white">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#fcc615]">
              BiblioDrop
            </p>

            <p className="mt-0.5 text-[10px] text-gray-400">
              Your books, delivered with care.
            </p>
          </div>

          <FiBookOpen className="h-5 w-5 text-[#fc1d15]" />
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal && selectedDelivery && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-3.5">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#fc1d15]">
                  Your Review
                </p>

                <h2 className="mt-0.5 text-base font-black text-gray-900">
                  Review Book
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setReviewModal(false)
                }
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-black hover:text-white"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">

              <div className="rounded-xl bg-[#fffdf8] p-3">
                <p className="text-[8px] font-black uppercase tracking-wider text-gray-400">
                  Book
                </p>

                <p className="mt-1 text-sm font-black text-gray-900">
                  {selectedDelivery.bookTitle ||
                    "Book Delivery"}
                </p>
              </div>

              {/* Rating */}
              <div className="mt-4">
                <p className="text-[9px] font-black uppercase tracking-wider text-gray-500">
                  Rating
                </p>

                <div className="mt-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setRating(star)
                        }
                        className="p-1"
                      >
                        <FiStar
                          className={`h-6 w-6 transition ${
                            star <= rating
                              ? "fill-[#fcc615] text-[#fcc615]"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    )
                  )}

                  <span className="ml-2 text-[10px] font-bold text-gray-400">
                    {rating}/5
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div className="mt-4">
                <label className="text-[9px] font-black uppercase tracking-wider text-gray-500">
                  Your Review
                </label>

                <textarea
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value)
                  }
                  rows={4}
                  placeholder="Write your experience with this book..."
                  className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-[11px] outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Submit */}
              <button
                type="button"
                disabled={reviewLoading}
                onClick={submitReview}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-[10px] font-black text-white transition hover:bg-[#fc1d15] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiSend className="h-3.5 w-3.5" />

                {reviewLoading
                  ? "Submitting..."
                  : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[300] w-[calc(100%-24px)] max-w-xs -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-2xl bg-black px-3.5 py-3 text-white shadow-2xl">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#fcc615] text-black">
              <FiRefreshCw className="h-4 w-4" />
            </div>

            <p className="text-[10px] font-semibold leading-4">
              {toast}
            </p>

            <button
              type="button"
              onClick={() => setToast("")}
              className="ml-auto text-lg leading-none text-gray-400 transition hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </main>
  );
}


// =========================
// STAT CARD
// =========================
function StatCard({
  icon,
  label,
  value,
  iconBg,
  iconColor,
}) {
  return (
    <div className="group rounded-[14px] border border-black/[0.06] bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-center justify-between">

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl ${iconBg} ${iconColor} transition-transform duration-300 group-hover:scale-105`}
        >
          <span className="text-sm">
            {icon}
          </span>
        </div>

        <span className="text-xl font-black tracking-tight text-gray-900">
          {value}
        </span>
      </div>

      <p className="mt-2 text-[9px] font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>
    </div>
  );
}


// =========================
// DELIVERY CARD
// =========================
function DeliveryCard({
  delivery,
  index,
  reviewed,
  onReview,
}) {
  const status =
    delivery.status || "Pending";

  const isDelivered =
    status === "Delivered" ||
    status === "Completed";

  const isPending =
    status === "Pending";

  return (
    <div
      className="group relative flex flex-col justify-between gap-3 overflow-hidden rounded-xl border border-black/[0.06] bg-[#fffdf9] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#fc1d15]/20 hover:shadow-md sm:flex-row sm:items-center"
      style={{
        animation: `userDeliveryIn .4s ease-out ${
          index * 70
        }ms both`,
      }}
    >
      <div className="flex min-w-0 items-center gap-3">

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${
            isDelivered
              ? "bg-emerald-50 text-emerald-600"
              : isPending
              ? "bg-[#fcc615]/20 text-[#9c7b00]"
              : "bg-[#fc1d15]/10 text-[#fc1d15]"
          }`}
        >
          {isDelivered ? (
            <FiCheckCircle className="h-4 w-4" />
          ) : (
            <FiTruck className="h-4 w-4" />
          )}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-[11px] font-black text-gray-900">
            {delivery.bookTitle ||
              "Book Delivery"}
          </h3>

          <p className="mt-0.5 truncate text-[9px] text-gray-400">
            Delivery #{delivery._id}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 sm:justify-end">

        <span
          className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
            isDelivered
              ? "bg-emerald-50 text-emerald-600"
              : isPending
              ? "bg-[#fff7d6] text-[#967500]"
              : "bg-[#fff0ef] text-[#fc1d15]"
          }`}
        >
          {status}
        </span>

        {/* Review Button */}
        {isDelivered && !reviewed && (
          <button
            type="button"
            onClick={onReview}
            className="inline-flex items-center gap-1 rounded-lg bg-black px-2.5 py-1.5 text-[8px] font-black text-white transition hover:bg-[#fc1d15]"
          >
            <FiStar className="h-2.5 w-2.5" />
            Review
          </button>
        )}

        {/* Already Reviewed */}
        {isDelivered && reviewed && (
          <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[8px] font-black text-blue-500">
            <FiCheckCircle className="h-2.5 w-2.5" />
            Reviewed
          </span>
        )}

        <FiArrowUpRight className="h-3.5 w-3.5 text-gray-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#fc1d15]" />
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#fc1d15] to-[#fcc615] transition-all duration-500 group-hover:w-full" />
    </div>
  );
}


// =========================
// QUICK LINK
// =========================
function QuickLink({
  href,
  icon,
  title,
  text,
  iconBg,
  iconColor,
  onClick,
}) {
  const content = (
    <>
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor} transition-transform duration-300 group-hover:scale-105`}
      >
        <span className="text-sm">
          {icon}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-[11px] font-black text-gray-900">
          {title}
        </h3>

        <p className="mt-0.5 text-[9px] text-gray-400">
          {text}
        </p>
      </div>

      <FiArrowUpRight className="h-3.5 w-3.5 shrink-0 text-gray-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#fc1d15]" />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group flex items-center gap-3 rounded-[14px] border border-black/[0.06] bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-[14px] border border-black/[0.06] bg-white p-3 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      {content}
    </button>
  );
}