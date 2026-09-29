"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-lg">
        {/* Success Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Heading */}
        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-[#fc1d15]">
          BiblioDrop
        </p>

        <h1 className="mt-2 text-3xl font-black text-gray-900">
          Payment Successful!
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
          Your delivery request has been successfully created.
          Your book is now marked as pending delivery.
        </p>

        {/* Status */}
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-700">
            Payment Status: Paid
          </p>

          <p className="mt-1 text-sm font-medium text-green-700">
            Delivery Status: Pending
          </p>
        </div>

        {/* Payment ID */}
        {paymentIntentId && (
          <div className="mt-5 rounded-xl bg-gray-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Payment Reference
            </p>

            <p className="mt-1 break-all text-xs text-gray-500">
              {paymentIntentId}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard/user"
            className="flex-1 rounded-xl bg-[#fc1d15] px-5 py-3 text-sm font-bold text-white transition hover:bg-red-600"
          >
            View My Deliveries
          </Link>

          <Link
            href="/browse-books"
            className="flex-1 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
          >
            Browse More Books
          </Link>
        </div>

        <Link
          href="/"
          className="mt-5 inline-block text-sm font-medium text-gray-400 transition hover:text-gray-700"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}