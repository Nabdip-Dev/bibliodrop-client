"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError("Payment session not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/verify-payment/${sessionId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Payment verification failed"
          );
        }

        setSuccess(true);
      } catch (err) {
        console.error(err);
        setError(
          err.message || "Payment verification failed."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  // ================================
  // Loading
  // ================================
  if (loading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffdf8] px-4 py-6">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -left-24 top-20 h-56 w-56 rounded-full bg-[#fc1d15]/[0.05] blur-3xl" />

        <div className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-[#fcc615]/[0.09] blur-3xl" />

        <div className="relative w-full max-w-sm">
          <div className="rounded-[24px] border border-black/[0.06] bg-white p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.07)]">
            {/* Spinner */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fc1d15]/[0.07]">
              <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#fc1d15]/15 border-t-[#fc1d15]" />
            </div>

            <p className="mt-5 text-lg font-black text-black">
              Verifying Payment
            </p>

            <p className="mt-1.5 text-xs leading-5 text-gray-500">
              Please wait while we securely verify your payment.
            </p>

            {/* Progress dots */}
            <div className="mt-5 flex justify-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#fc1d15]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#fcc615] [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#fc1d15] [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ================================
  // Error
  // ================================
  if (error || !success) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffdf8] px-4 py-6">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -left-24 top-20 h-56 w-56 rounded-full bg-[#fc1d15]/[0.05] blur-3xl" />

        <div className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-[#fcc615]/[0.08] blur-3xl" />

        <div className="relative w-full max-w-sm">
          <div className="overflow-hidden rounded-[24px] border border-black/[0.06] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.08)]">
            {/* Top accent */}
            <div className="h-1.5 bg-[#fc1d15]" />

            <div className="p-6 text-center sm:p-7">
              {/* Error Icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fc1d15]/[0.08]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fc1d15] text-white shadow-[4px_4px_0_#fcc615]">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <path d="M12 8v5" />
                    <path d="M12 16.5h.01" />
                    <path d="M10.3 3.8 2.9 17a2 2 0 0 0 1.75 3h14.7a2 2 0 0 0 1.75-3l-7.4-13.2a2 2 0 0 0-3.4 0Z" />
                  </svg>
                </div>
              </div>

              <div className="mt-5">
                <span className="rounded-full bg-[#fc1d15]/[0.07] px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-[#fc1d15]">
                  Payment Issue
                </span>

                <h1 className="mt-3 text-xl font-black tracking-tight text-black sm:text-2xl">
                  Payment Verification Failed
                </h1>

                <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-gray-500">
                  {error || "Something went wrong while verifying your payment."}
                </p>
              </div>

              {/* Info box */}
              <div className="mt-5 rounded-xl border border-black/[0.06] bg-[#fafafa] px-4 py-3 text-left">
                <div className="flex gap-2.5">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 11v5" />
                    <path d="M12 8h.01" />
                  </svg>

                  <p className="text-[10px] leading-4 text-gray-500">
                    If your payment was already charged, please check
                    your dashboard before trying again.
                  </p>
                </div>
              </div>

              {/* Dashboard Button */}
              <Link
                href="/dashboard/user"
                className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-xs font-black text-white shadow-[4px_4px_0_#fcc615] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fc1d15] hover:shadow-[5px_5px_0_#fcc615]"
              >
                Go to Dashboard

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
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ================================
  // Success
  // ================================
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffdf8] px-4 py-6">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-28 top-10 h-64 w-64 rounded-full bg-emerald-400/[0.06] blur-3xl" />

      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#fcc615]/[0.10] blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="overflow-hidden rounded-[26px] border border-black/[0.06] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.08)]">
          {/* Success accent */}
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-[#fcc615]" />

          <div className="p-6 text-center sm:p-7">
            {/* Animated Success Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[22px] bg-emerald-50">
              <div className="flex h-12 w-12 animate-[successPop_.55s_ease-out] items-center justify-center rounded-full bg-emerald-500 shadow-[5px_5px_0_#fcc615]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 animate-[checkDraw_.5s_ease-out_.2s_both] text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 12 4.5 4.5L19 7" />
                </svg>
              </div>
            </div>

            {/* Badge */}
            <div className="mt-5">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-emerald-600">
                Payment Confirmed
              </span>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-black sm:text-[27px]">
                Payment Successful
              </h1>

              <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-gray-500">
                Your payment has been verified successfully. Your
                order is now being processed.
              </p>
            </div>

            {/* Confirmation Card */}
            <div className="mt-5 rounded-2xl border border-black/[0.06] bg-[#fafafa] p-4 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-[#fcc615]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                    />
                    <path d="M3 10h18" />
                  </svg>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-wide text-gray-400">
                    Transaction Status
                  </p>

                  <p className="mt-0.5 text-xs font-black text-emerald-600">
                    Verified Successfully
                  </p>
                </div>

                <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="m6 12 4 4 8-8" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Dashboard Button */}
            <Link
              href="/dashboard/user"
              className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#fc1d15] px-5 py-3 text-xs font-black text-white shadow-[4px_4px_0_#fcc615] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#fcc615] active:translate-y-0 active:shadow-[2px_2px_0_#fcc615]"
            >
              Go to Dashboard

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
            </Link>

            <p className="mt-4 text-[9px] leading-4 text-gray-400">
              Thank you for using BiblioDrop.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes successPop {
          0% {
            opacity: 0;
            transform: scale(0.65);
          }
          70% {
            transform: scale(1.08);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes checkDraw {
          from {
            opacity: 0;
            transform: scale(0.7);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </main>
  );
}
