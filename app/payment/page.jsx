"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { authClient } from "@/lib/auth-client";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const API_URL = process.env.NEXT_PUBLIC_SERVER;

function PaymentForm({ bookId, quantity }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [elementReady, setElementReady] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe) {
      setError("Stripe is still loading. Please wait.");
      return;
    }

    if (!elements) {
      setError("Payment form is still loading. Please wait.");
      return;
    }

    if (!elementReady) {
      setError("Payment form is not ready yet. Please wait.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data: session } = await authClient.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (result.error) {
        setError(
          result.error.message || "Payment could not be completed."
        );
        return;
      }

      const paymentIntent = result.paymentIntent;

      if (!paymentIntent) {
        setError("Payment information was not received.");
        return;
      }

      if (paymentIntent.status !== "succeeded") {
        setError(
          `Payment was not completed. Status: ${paymentIntent.status}`
        );
        return;
      }

      const confirmResponse = await fetch(
        `${API_URL}/confirm-payment/${paymentIntent.id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookId,
            quantity,
          }),
        }
      );

      const confirmData = await confirmResponse.json();

      if (!confirmResponse.ok) {
        throw new Error(
          confirmData.message ||
            "Payment succeeded, but delivery could not be created."
        );
      }

      router.replace(
        `/payment-success?payment_intent=${encodeURIComponent(
          paymentIntent.id
        )}`
      );
    } catch (error) {
      console.error("PAYMENT SUBMIT ERROR:", error);

      setError(
        error?.message ||
          "Something went wrong while processing your payment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#fc1d15]">
                Secure Checkout
              </p>

              <h2 className="mt-0.5 text-lg font-bold text-gray-900">
                Payment Details
              </h2>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#fc1d15]">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 10h18" />
              </svg>
            </div>
          </div>
        </div>

        <div className="px-5 py-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5">
            <PaymentElement
              onReady={() => {
                setElementReady(true);
                setError("");
              }}
              onLoadError={(event) => {
                console.error(
                  "STRIPE PAYMENT ELEMENT LOAD ERROR:",
                  event
                );

                setElementReady(false);

                setError(
                  "Stripe payment form could not be loaded. Please refresh the page."
                );
              }}
            />
          </div>
        </div>

        {error && (
          <div className="mx-5 mb-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-3 text-sm text-red-600">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold">
              !
            </span>

            <span>{error}</span>
          </div>
        )}

        <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4">
          <button
            type="submit"
            disabled={
              !stripe ||
              !elements ||
              !elementReady ||
              loading
            }
            className="flex w-full items-center justify-center rounded-xl bg-[#fc1d15] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-[#e91b14] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Processing...
              </span>
            ) : !elementReady ? (
              "Loading Payment..."
            ) : (
              <span className="flex items-center gap-2">
                Pay Now
                <span className="text-base">→</span>
              </span>
            )}
          </button>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="5" y="10" width="14" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 018 0v3" />
            </svg>

            <span>Secure payment powered by Stripe</span>
          </div>
        </div>
      </div>
    </form>
  );
}

function PaymentPageContent() {
  const searchParams = useSearchParams();

  const clientSecret = searchParams.get("clientSecret");
  const bookId = searchParams.get("bookId");

  const quantity =
    Number(searchParams.get("quantity")) || 1;

  const [error, setError] = useState("");

  useEffect(() => {
    if (!clientSecret) {
      setError("Payment session is missing or invalid.");
      return;
    }

    if (!bookId) {
      setError("Book information is missing.");
    }
  }, [clientSecret, bookId]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] px-4 py-8">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-7 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-500">
            !
          </div>

          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Payment Error
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error}
          </p>
        </div>
      </main>
    );
  }

  if (!clientSecret || !bookId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8] px-4">
        <div className="text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-[#fc1d15]" />

          <p className="mt-3 text-sm text-gray-500">
            Loading payment...
          </p>
        </div>
      </main>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#fc1d15",
        colorText: "#171717",
        colorTextSecondary: "#737373",
        borderRadius: "10px",
        fontFamily: "Inter, system-ui, sans-serif",
        spacingUnit: "3px",
      },
      rules: {
        ".Input": {
          boxShadow: "none",
          border: "1px solid #e5e7eb",
        },
        ".Input:focus": {
          border: "1px solid #fc1d15",
          boxShadow: "0 0 0 2px rgba(252,29,21,0.08)",
        },
        ".Label": {
          fontSize: "12px",
          fontWeight: "600",
        },
      },
    },
  };

  return (
    <main className="min-h-screen bg-[#f7f7f8] px-4 py-6 sm:py-8">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="group flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition hover:text-gray-900"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">
              ←
            </span>
            Back
          </button>

          <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 shadow-sm ring-1 ring-gray-100">
            Checkout
          </span>
        </div>

        <div className="mb-5 text-center">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-sm font-black text-[#fc1d15]">
            B
          </div>

          <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-[27px]">
            Complete Your Payment
          </h1>

          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-500">
            <span>Book delivery</span>

            <span className="h-1 w-1 rounded-full bg-gray-300" />

            <span>
              {quantity} {quantity === 1 ? "item" : "items"}
            </span>
          </div>
        </div>

        <Elements stripe={stripePromise} options={options}>
          <PaymentForm
            bookId={bookId}
            quantity={quantity}
          />
        </Elements>

        <p className="mt-4 text-center text-[10px] leading-5 text-gray-400">
          By continuing, your payment will be securely processed
          through Stripe.
        </p>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f7f7f8]">
          <div className="text-center">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-[#fc1d15]" />

            <p className="mt-3 text-sm text-gray-500">
              Loading payment...
            </p>
          </div>
        </main>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}
