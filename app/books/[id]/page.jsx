"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import ReviewCard from "@/components/ReviewCard";

export default function BookDetails() {
  const params = useParams();
  const router = useRouter();

  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // Order states
  const [quantity, setQuantity] = useState(1);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // ================================
  // Login Protection
  // ================================
  useEffect(() => {
    if (sessionLoading) return;

    if (!session?.user) {
      router.replace("/login");
    }
  }, [session, sessionLoading, router]);

  // ================================
  // Fetch Book
  // ================================
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/books/${params.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch book");
        }

        const data = await response.json();

        setBook(data);
      } catch (error) {
        console.error("BOOK ERROR:", error);
        setError("Failed to load book details.");
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      fetchBook();
    }
  }, [params?.id]);

  // ================================
  // Fetch Book Reviews
  // ================================
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);

        const response = await fetch(
          `http://localhost:5000/books/${params.id}/reviews`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();

        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("REVIEWS ERROR:", error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (params?.id) {
      fetchReviews();
    }
  }, [params?.id]);

  // ================================
  // Toast
  // ================================
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  // ================================
  // Loading
  // ================================
  if (sessionLoading || !session?.user || loading) {
    return (
      <main className="min-h-screen bg-[#fffdf8] px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 h-8 w-32 animate-pulse rounded-full bg-gray-200" />

          <div className="grid gap-5 overflow-hidden rounded-[24px] border border-black/[0.06] bg-white p-4 shadow-[0_15px_50px_rgba(0,0,0,0.06)] md:grid-cols-[0.85fr_1.15fr] md:p-5">
            <div className="h-[420px] animate-pulse rounded-[20px] bg-gray-200" />

            <div className="space-y-4 p-2 md:p-5">
              <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
              <div className="h-10 w-4/5 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
              <div className="h-20 animate-pulse rounded bg-gray-200" />
              <div className="h-28 animate-pulse rounded bg-gray-200" />
              <div className="h-12 animate-pulse rounded-xl bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ================================
  // Error
  // ================================
  if (error || !book) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffdf8] px-5">
        <div className="w-full max-w-md rounded-[24px] border border-black/[0.06] bg-white p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fc1d15]/10">
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 text-[#fc1d15]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.3 3.7 2.8 17a2 2 0 0 0 1.75 3h14.9a2 2 0 0 0 1.75-3L13.7 3.7a2 2 0 0 0-3.4 0Z" />
            </svg>
          </div>

          <h1 className="text-2xl font-black text-black">
            Book Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error || "The book you are looking for does not exist."}
          </p>

          <Link
            href="/browse-books"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fc1d15]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>

            Back to Browse
          </Link>
        </div>
      </main>
    );
  }

  const isAvailable = book.status === "available";

  const isOwner =
    String(book.librarianId || "") ===
    String(session?.user?.id || "");

  const canRequestDelivery =
    isAvailable && !isOwner;

  const deliveryFee = Number(book.deliveryFee) || 0;

  const totalDeliveryFee = deliveryFee * quantity;

  // ================================
  // Open Order Modal
  // ================================
  const handleRequest = () => {
    if (!isAvailable) return;

    setQuantity(1);
    setShowOrderModal(true);
  };

  // ================================
  // Quantity Controls
  // ================================
  const increaseQuantity = () => {
    setQuantity((current) => Math.min(current + 1, 10));
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(current - 1, 1));
  };

  // ================================
  // Proceed To Payment
  // ================================
  const handleProceedToPayment = async () => {
    try {
      setPaymentLoading(true);
      setToast("");

      const { data: session } = await authClient.getSession();

      if (!session?.user) {
        setToast("Please login to continue.");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookId: book._id,
            quantity,
            userId: session.user.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to start payment");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("PAYMENT ERROR:", error);

      setToast(
        error.message || "Payment could not be started."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffdf8] px-4 py-5 sm:px-6">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-24 top-20 h-60 w-60 rounded-full bg-[#fc1d15]/[0.05] blur-3xl" />

      <div className="pointer-events-none absolute -right-24 top-40 h-72 w-72 rounded-full bg-[#fcc615]/[0.10] blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Back Button */}
        <div className="mb-5 flex items-center justify-between">
          <Link
            href="/browse-books"
            className="group inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-bold text-black shadow-sm transition-all duration-300 hover:-translate-x-1 hover:border-[#fc1d15]/30 hover:text-[#fc1d15]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>

            Browse Books
          </Link>

          <span className="hidden rounded-full bg-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white sm:block">
            Book Details
          </span>
        </div>

        {/* Main Book Area */}
        <section className="grid gap-5 overflow-hidden rounded-[28px] border border-black/[0.06] bg-white p-4 shadow-[0_20px_70px_rgba(0,0,0,0.07)] md:grid-cols-[0.78fr_1.22fr] md:p-5">
          {/* Cover */}
          <div className="group relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#fff8dc] via-white to-[#fff0ef] p-4">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#fcc615]/20 blur-2xl" />

            <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#fc1d15]/10 blur-2xl" />

            <div className="relative flex min-h-[390px] items-center justify-center overflow-hidden rounded-[18px] border border-black/[0.06] bg-white/70 p-4">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="max-h-[390px] w-full rounded-xl object-contain drop-shadow-[0_18px_25px_rgba(0,0,0,0.16)] transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#fc1d15] shadow-[8px_8px_0_#fcc615]">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-12 w-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    >
                      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5Z" />
                      <path d="M4 5.5v16" />
                      <path d="M8 7h8" />
                      <path d="M8 11h8" />
                    </svg>
                  </div>

                  <p className="mt-5 text-sm font-bold text-gray-500">
                    No Cover Available
                  </p>
                </div>
              )}
            </div>

            <div className="relative mt-4 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">
                BiblioDrop Collection
              </span>

              <span className="h-2 w-2 rounded-full bg-[#fc1d15]" />
            </div>
          </div>

          {/* Information */}
          <div className="flex flex-col justify-center px-1 py-2 md:px-5 md:py-4">
            {/* Category + Status */}
            <div className="flex flex-wrap items-center gap-2">
              {book.category && (
                <span className="rounded-full bg-[#fcc615]/20 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-black">
                  {book.category}
                </span>
              )}

              <span
                className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${isAvailable
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-[#fc1d15]"
                  }`}
              >
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />

                {isAvailable ? "Available" : "Checked Out"}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-4 max-w-2xl text-3xl font-black leading-[1.08] tracking-tight text-black sm:text-4xl">
              {book.title}
            </h1>

            {/* Author */}
            <p className="mt-2 text-sm font-semibold text-gray-500">
              Written by{" "}
              <span className="text-[#fc1d15]">
                {book.author}
              </span>
            </p>

            {/* Description */}
            <div className="mt-5 rounded-2xl bg-[#fafafa] p-4">
              <p className="text-sm leading-6 text-gray-600">
                {book.description ||
                  "No description available for this book."}
              </p>
            </div>

            {/* Information Grid */}
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/[0.06] bg-white p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                  Delivery
                </p>

                <p className="mt-1 text-lg font-black text-black">
                  ₹{deliveryFee}
                </p>
              </div>

              <div className="rounded-2xl border border-black/[0.06] bg-white p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                  Published
                </p>

                <p className="mt-1 text-sm font-black text-black">
                  {book.published ? "Yes" : "No"}
                </p>
              </div>

              <div className="rounded-2xl border border-black/[0.06] bg-white p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                  Status
                </p>

                <p
                  className={`mt-1 text-sm font-black ${isAvailable
                    ? "text-emerald-600"
                    : "text-[#fc1d15]"
                    }`}
                >
                  {isAvailable ? "Ready" : "Unavailable"}
                </p>
              </div>
            </div>

            {/* Request Button */}
            <button
              onClick={handleRequest}
              disabled={!canRequestDelivery}
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-black transition-all duration-300 ${canRequestDelivery
                ? "bg-[#fc1d15] text-white shadow-[5px_5px_0_#fcc615] hover:-translate-y-1 hover:shadow-[7px_7px_0_#fcc615]"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
                }`}
            >
              {isOwner ? (
                "This Is Your Book"
              ) : isAvailable ? (
                <>
                  Request Delivery
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </>
              ) : (
                "Currently Unavailable"
              )}
            </button>
          </div>
        </section>

        {/* ================= Reviews ================= */}
        <section className="mt-5 rounded-[24px] border border-black/[0.06] bg-white p-5 shadow-[0_15px_50px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-[#fcc615]"
                    fill="currentColor"
                  >
                    <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
                  </svg>
                </div>

                <h2 className="text-xl font-black text-black">
                  Reader Reviews
                </h2>
              </div>

              <p className="mt-1 text-xs text-gray-500">
                What readers think about this book.
              </p>
            </div>

            <span className="w-fit rounded-full bg-[#fcc615]/15 px-3 py-1.5 text-[11px] font-bold text-black">
              {reviews.length}{" "}
              {reviews.length === 1 ? "Review" : "Reviews"}
            </span>
          </div>

          {/* Reviews */}
          {reviewsLoading ? (
            <div className="mt-4 space-y-3">
              <div className="h-24 animate-pulse rounded-2xl bg-gray-100" />
              <div className="h-24 animate-pulse rounded-2xl bg-gray-100" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="mt-4 space-y-3">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                />
              ))}
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-center rounded-2xl border border-dashed border-black/10 bg-[#fafafa] px-5 py-8 text-center">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-[#fc1d15]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path d="M20 15a3 3 0 0 1-3 3H9l-5 3v-6a3 3 0 0 1-1-2.2V7a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v8Z" />
                  </svg>
                </div>

                <p className="mt-3 text-sm font-bold text-gray-600">
                  No reviews yet
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Be the first reader to share an experience.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ================= Order Summary Modal ================= */}
      {showOrderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.25)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#fc1d15]">
                  BiblioDrop
                </p>

                <h2 className="mt-1 text-xl font-black text-black">
                  Order Summary
                </h2>
              </div>

              <button
                onClick={() => setShowOrderModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-lg font-bold text-gray-500 transition hover:bg-black hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Book */}
            <div className="p-5">
              <div className="flex gap-4 rounded-2xl bg-[#fafafa] p-3">
                <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#fc1d15]">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-7 w-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      >
                        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5Z" />
                        <path d="M4 5.5v16" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-base font-black text-black">
                    {book.title}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    by {book.author}
                  </p>

                  <p className="mt-2 text-sm font-black text-[#fc1d15]">
                    ₹{deliveryFee} delivery / book
                  </p>
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-black">
                    Quantity
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Maximum 10 books
                  </p>
                </div>

                <div className="flex items-center rounded-xl border border-black/10 bg-white">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="flex h-10 w-10 items-center justify-center text-lg font-black text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                  >
                    −
                  </button>

                  <span className="flex h-10 w-10 items-center justify-center border-x border-black/10 text-sm font-black">
                    {quantity}
                  </span>

                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= 10}
                    className="flex h-10 w-10 items-center justify-center text-lg font-black text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mt-5 rounded-2xl border border-black/[0.06] bg-white p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Delivery fee
                  </span>

                  <span className="font-bold text-black">
                    ₹{deliveryFee}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Quantity
                  </span>

                  <span className="font-bold text-black">
                    × {quantity}
                  </span>
                </div>

                <div className="my-3 border-t border-dashed border-black/10" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-black">
                    Total
                  </span>

                  <span className="text-xl font-black text-[#fc1d15]">
                    ₹{totalDeliveryFee}
                  </span>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={paymentLoading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#fc1d15] px-5 py-3.5 text-sm font-black text-white shadow-[5px_5px_0_#fcc615] transition-all duration-300 hover:-translate-y-1 hover:shadow-[7px_7px_0_#fcc615] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {paymentLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Preparing Payment...
                  </>
                ) : (
                  <>
                    Proceed to Payment

                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-[10px] leading-4 text-gray-400">
                You will be redirected to secure Stripe Checkout
                after confirming your order.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= Toast ================= */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-32px)] max-w-sm -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-2xl bg-black px-4 py-3.5 text-white shadow-[0_15px_50px_rgba(0,0,0,0.2)]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#fcc615]">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 8v4l2.5 2.5" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>

            <p className="text-xs font-semibold leading-5">
              {toast}
            </p>

            <button
              onClick={() => setToast("")}
              className="ml-auto text-gray-400 transition hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </main>
  );
}