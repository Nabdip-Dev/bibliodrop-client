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

  const [quantity, setQuantity] = useState(1);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

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
  // Fetch Reviews
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
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="mb-5 h-9 w-32 rounded-xl bg-gray-200" />

          <div className="grid gap-5 rounded-[22px] border border-black/5 bg-white p-4 shadow-sm md:grid-cols-[.8fr_1.2fr]">
            <div className="h-[380px] rounded-[18px] bg-gray-200" />

            <div className="space-y-4 p-2 md:p-5">
              <div className="h-6 w-24 rounded-full bg-gray-200" />
              <div className="h-9 w-4/5 rounded-lg bg-gray-200" />
              <div className="h-4 w-1/3 rounded bg-gray-200" />
              <div className="h-20 rounded-xl bg-gray-200" />
              <div className="h-24 rounded-xl bg-gray-200" />
              <div className="h-12 rounded-xl bg-gray-200" />
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
        <div className="w-full max-w-sm rounded-[22px] border border-black/5 bg-white p-7 text-center shadow-[0_15px_45px_rgba(0,0,0,.07)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fc1d15]/10">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7 text-[#fc1d15]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.3 3.7 2.8 17a2 2 0 0 0 1.75 3h14.9a2 2 0 0 0 1.75-3L13.7 3.7a2 2 0 0 0-3.4 0Z" />
            </svg>
          </div>

          <h1 className="mt-4 text-xl font-black text-black">
            Book Not Found
          </h1>

          <p className="mt-2 text-sm leading-5 text-gray-500">
            {error || "The book you are looking for does not exist."}
          </p>

          <Link
            href="/browse-books"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fc1d15]"
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

  const canRequestDelivery = isAvailable && !isOwner;

  const deliveryFee = Number(book.deliveryFee) || 0;
  const totalDeliveryFee = deliveryFee * quantity;

  // ================================
  // Request
  // ================================
  const handleRequest = () => {
    if (!isAvailable) return;

    setQuantity(1);
    setShowOrderModal(true);
  };

  // ================================
  // Quantity
  // ================================
  const increaseQuantity = () => {
    setQuantity((current) => Math.min(current + 1, 10));
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(current - 1, 1));
  };

  // ================================
  // Payment
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
        throw new Error(
          data.message || "Failed to start payment"
        );
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
      {/* Soft Background */}
      <div className="pointer-events-none absolute left-[-100px] top-24 h-56 w-56 rounded-full bg-[#fc1d15]/[0.035] blur-3xl" />
      <div className="pointer-events-none absolute right-[-100px] top-44 h-64 w-64 rounded-full bg-[#fcc615]/[0.07] blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        {/* Top Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/browse-books"
            className="group inline-flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-3.5 py-2 text-xs font-bold text-black shadow-sm transition-all duration-300 hover:-translate-x-0.5 hover:border-[#fc1d15]/30 hover:text-[#fc1d15]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>

            Browse Books
          </Link>

          <span className="hidden rounded-full bg-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white sm:block">
            Book Details
          </span>
        </div>

        {/* ================= Main Card ================= */}
        <section className="grid overflow-hidden rounded-[22px] border border-black/[0.06] bg-white p-3.5 shadow-[0_14px_45px_rgba(0,0,0,.055)] transition-shadow duration-500 hover:shadow-[0_18px_55px_rgba(0,0,0,.075)] md:grid-cols-[.8fr_1.2fr] md:p-4">
          {/* Cover */}
          <div className="group relative overflow-hidden rounded-[18px] bg-gradient-to-br from-[#fff9e4] via-white to-[#fff1ef] p-3">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#fcc615]/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-[#fc1d15]/10 blur-2xl" />

            <div className="relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-[15px] border border-black/[0.05] bg-white/75 p-4">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="max-h-[340px] w-full rounded-lg object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,.13)] transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[20px] bg-[#fc1d15] shadow-[6px_6px_0_#fcc615] transition-transform duration-300 group-hover:scale-105">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-10 w-10 text-white"
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

                  <p className="mt-4 text-xs font-bold text-gray-500">
                    No Cover Available
                  </p>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between px-1">
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-400">
                BiblioDrop Collection
              </span>

              <span className="h-1.5 w-1.5 rounded-full bg-[#fc1d15]" />
            </div>
          </div>

          {/* Information */}
          <div className="flex flex-col justify-center px-1 py-4 md:px-6 md:py-5">
            {/* Category + Status */}
            <div className="flex flex-wrap items-center gap-2">
              {book.category && (
                <span className="rounded-full bg-[#fcc615]/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-black">
                  {book.category}
                </span>
              )}

              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  isAvailable
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-[#fc1d15]"
                }`}
              >
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                {isAvailable ? "Available" : "Checked Out"}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-3 max-w-xl text-[27px] font-black leading-[1.12] tracking-tight text-black sm:text-3xl">
              {book.title}
            </h1>

            {/* Author */}
            <p className="mt-2 text-xs font-semibold text-gray-500">
              Written by{" "}
              <span className="font-bold text-[#fc1d15]">
                {book.author}
              </span>
            </p>

            {/* Description */}
            <div className="mt-4 rounded-xl bg-[#fafafa] px-3.5 py-3">
              <p className="text-xs leading-5 text-gray-600">
                {book.description ||
                  "No description available for this book."}
              </p>
            </div>

            {/* Info */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-black/[0.055] bg-white px-3 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/10 hover:shadow-sm">
                <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                  Delivery
                </p>

                <p className="mt-1 text-base font-black text-black">
                  ₹{deliveryFee}
                </p>
              </div>

              <div className="rounded-xl border border-black/[0.055] bg-white px-3 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/10 hover:shadow-sm">
                <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                  Published
                </p>

                <p className="mt-1 text-sm font-black text-black">
                  {book.published ? "Yes" : "No"}
                </p>
              </div>

              <div className="rounded-xl border border-black/[0.055] bg-white px-3 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/10 hover:shadow-sm">
                <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                  Status
                </p>

                <p
                  className={`mt-1 text-sm font-black ${
                    isAvailable
                      ? "text-emerald-600"
                      : "text-[#fc1d15]"
                  }`}
                >
                  {isAvailable ? "Ready" : "Unavailable"}
                </p>
              </div>
            </div>

            {/* Request */}
            <button
              onClick={handleRequest}
              disabled={!canRequestDelivery}
              className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-black transition-all duration-300 ${
                canRequestDelivery
                  ? "bg-[#fc1d15] text-white shadow-[4px_4px_0_#fcc615] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#fcc615] active:translate-y-0 active:shadow-[2px_2px_0_#fcc615]"
                  : "cursor-not-allowed bg-gray-100 text-gray-400"
              }`}
            >
              {isOwner ? (
                "This Is Your Book"
              ) : isAvailable ? (
                <>
                  Request Delivery
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
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
        <section className="mt-4 rounded-[20px] border border-black/[0.06] bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,.045)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 text-[#fcc615]"
                  fill="currentColor"
                >
                  <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
                </svg>
              </div>

              <div>
                <h2 className="text-base font-black text-black">
                  Reader Reviews
                </h2>

                <p className="hidden text-[10px] text-gray-400 sm:block">
                  What readers think about this book.
                </p>
              </div>
            </div>

            <span className="rounded-full bg-[#fcc615]/15 px-2.5 py-1 text-[10px] font-bold text-black">
              {reviews.length}{" "}
              {reviews.length === 1 ? "Review" : "Reviews"}
            </span>
          </div>

          {reviewsLoading ? (
            <div className="mt-3 space-y-2.5">
              <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
              <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="mt-3 space-y-2.5">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                />
              ))}
            </div>
          ) : (
            <div className="mt-3 flex items-center justify-center rounded-xl border border-dashed border-black/10 bg-[#fafafa] px-4 py-7 text-center">
              <div>
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-[#fc1d15]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path d="M20 15a3 3 0 0 1-3 3H9l-5 3v-6a3 3 0 0 1-1-2.2V7a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v8Z" />
                  </svg>
                </div>

                <p className="mt-2 text-xs font-bold text-gray-600">
                  No reviews yet
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  Be the first reader to share an experience.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ================= Order Modal ================= */}
      {showOrderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4 py-5 backdrop-blur-[3px]">
          <div className="w-full max-w-sm animate-[modalIn_.25s_ease-out] overflow-hidden rounded-[22px] bg-white shadow-[0_25px_70px_rgba(0,0,0,.22)]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-3.5">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#fc1d15]">
                  BiblioDrop
                </p>

                <h2 className="mt-0.5 text-lg font-black text-black">
                  Order Summary
                </h2>
              </div>

              <button
                onClick={() => setShowOrderModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-base font-bold text-gray-500 transition-all duration-200 hover:rotate-90 hover:bg-black hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="p-4">
              {/* Book */}
              <div className="flex gap-3 rounded-xl bg-[#fafafa] p-2.5">
                <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
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
                        className="h-6 w-6 text-white"
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
                  <h3 className="truncate text-sm font-black text-black">
                    {book.title}
                  </h3>

                  <p className="mt-0.5 text-[10px] text-gray-500">
                    by {book.author}
                  </p>

                  <p className="mt-1.5 text-xs font-black text-[#fc1d15]">
                    ₹{deliveryFee} delivery / book
                  </p>
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-black">
                    Quantity
                  </p>

                  <p className="mt-0.5 text-[10px] text-gray-400">
                    Maximum 10 books
                  </p>
                </div>

                <div className="flex items-center overflow-hidden rounded-lg border border-black/10">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="flex h-8 w-8 items-center justify-center text-base font-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                  >
                    −
                  </button>

                  <span className="flex h-8 w-8 items-center justify-center border-x border-black/10 text-xs font-black">
                    {quantity}
                  </span>

                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= 10}
                    className="flex h-8 w-8 items-center justify-center text-base font-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mt-4 rounded-xl border border-black/[0.06] bg-white p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Delivery fee
                  </span>

                  <span className="font-bold text-black">
                    ₹{deliveryFee}
                  </span>
                </div>

                <div className="mt-1.5 flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Quantity
                  </span>

                  <span className="font-bold text-black">
                    × {quantity}
                  </span>
                </div>

                <div className="my-2.5 border-t border-dashed border-black/10" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-black">
                    Total
                  </span>

                  <span className="text-lg font-black text-[#fc1d15]">
                    ₹{totalDeliveryFee}
                  </span>
                </div>
              </div>

              {/* Payment */}
              <button
                onClick={handleProceedToPayment}
                disabled={paymentLoading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#fc1d15] px-4 py-3 text-xs font-black text-white shadow-[4px_4px_0_#fcc615] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#fcc615] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paymentLoading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Preparing Payment...
                  </>
                ) : (
                  <>
                    Proceed to Payment

                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
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

              <p className="mt-2.5 text-center text-[9px] leading-4 text-gray-400">
                You will be redirected to secure Stripe Checkout
                after confirming your order.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= Toast ================= */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 z-[110] w-[calc(100%-28px)] max-w-xs -translate-x-1/2 animate-[toastIn_.3s_ease-out]">
          <div className="flex items-center gap-2.5 rounded-xl bg-black px-3.5 py-3 text-white shadow-[0_12px_35px_rgba(0,0,0,.2)]">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fcc615]">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 8v4l2.5 2.5" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>

            <p className="text-[10px] font-semibold leading-4">
              {toast}
            </p>

            <button
              onClick={() => setToast("")}
              className="ml-auto text-sm text-gray-400 transition hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
