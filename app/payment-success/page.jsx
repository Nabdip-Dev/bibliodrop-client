"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] px-4 py-6 sm:py-8">
      <div className="w-full max-w-lg">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
          <div className="h-1 bg-[#fc1d15]" />

          <div className="px-5 py-7 text-center sm:px-7 sm:py-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 ring-8 ring-green-50/60">
              <svg
                className="h-7 w-7 text-green-600"
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

            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fc1d15]">
              BiblioDrop
            </p>

            <h1 className="mt-1.5 text-2xl font-black tracking-tight text-gray-900 sm:text-[27px]">
              Payment Successful
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-gray-500">
              Your delivery request has been created successfully.
              Your book is now waiting for delivery.
            </p>

            <div className="mt-5 rounded-xl border border-green-100 bg-green-50/70 p-3.5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100">
                    <svg
                      className="h-4 w-4 text-green-600"
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
                  </span>

                  <div className="text-left">
                    <p className="text-xs font-semibold text-gray-500">
                      Payment
                    </p>
                    <p className="text-sm font-bold text-green-700">
                      Paid
                    </p>
                  </div>
                </div>

                <div className="h-8 w-px bg-green-200" />

                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-500">
                    Delivery
                  </p>
                  <p className="text-sm font-bold text-amber-600">
                    Pending
                  </p>
                </div>
              </div>
            </div>

            {paymentIntentId && (
              <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-3 text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Payment Reference
                </p>

                <p className="mt-1.5 break-all font-mono text-[11px] leading-4 text-gray-500">
                  {paymentIntentId}
                </p>
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <Link
                href="/dashboard/user"
                className="flex items-center justify-center rounded-xl bg-[#fc1d15] px-4 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#e91b14] hover:shadow-md active:scale-[0.99]"
              >
                View My Deliveries
                <span className="ml-1.5">→</span>
              </Link>

              <Link
                href="/browse-books"
                className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.99]"
              >
                Browse More Books
              </Link>
            </div>

            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-gray-400 transition hover:text-gray-700"
            >
              <span>←</span>
              Back to Home
            </Link>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] leading-5 text-gray-400">
          Thank you for using BiblioDrop.
          <br />
          Your payment has been securely processed.
        </p>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8]">
          <div className="text-sm font-medium text-gray-500">
            Loading...
          </div>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
