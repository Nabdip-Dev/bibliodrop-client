"use client";

import { useEffect, useState } from "react";
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
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const API_URL =
  process.env.NEXT_PUBLIC_SERVER || "http://localhost:5000";

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
          result.error.message ||
          "Payment could not be completed."
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
        error.message ||
        "Something went wrong while processing your payment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-xl"
    >
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Secure Payment
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Delivery Payment
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Complete your payment securely with Stripe.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
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
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={
          !stripe ||
          !elements ||
          !elementReady ||
          loading
        }
        className="w-full rounded-xl bg-[#fc1d15] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Processing Payment..."
          : !elementReady
            ? "Loading Payment..."
            : "Pay Now"}
      </button>

      <p className="mt-4 text-center text-xs text-gray-400">
        Your payment is securely processed by Stripe.
      </p>
    </form>
  );
}

export default function PaymentPage() {
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
      <main className="min-h-[70vh] bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl font-bold text-red-600">
            !
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Payment Error
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>
        </div>
      </main>
    );
  }

  if (!clientSecret || !bookId) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <p className="text-sm text-gray-500">
          Loading payment...
        </p>
      </main>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#fc1d15",
        borderRadius: "10px",
      },
    },
  };
 
  return (
    <main className="min-h-[80vh] bg-gray-50 px-4 py-10">
      <div className="mx-auto mb-8 max-w-xl">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
        >
          ← Back
        </button>

        <div className="mt-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#fc1d15]">
            BiblioDrop
          </p>

          <h1 className="mt-1 text-3xl font-black text-gray-900">
            Complete Your Payment
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Quantity: {quantity}
          </p>
        </div>
      </div>


      <Elements
        stripe={stripePromise}
        options={options}
      >
        <PaymentForm
          bookId={bookId}
          quantity={quantity}
        />
      </Elements>
    </main>
  );
}