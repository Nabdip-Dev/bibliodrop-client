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
          throw new Error(data.message || "Payment verification failed");
        }

        setSuccess(true);
      } catch (err) {
        console.error(err);
        setError(err.message || "Payment verification failed.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-sm font-semibold text-gray-500">
          Verifying payment...
        </p>
      </main>
    );
  }

  if (error || !success) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-black text-red-600">
            Payment Verification Failed
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error || "Something went wrong."}
          </p>

          <Link
            href="/dashboard/user"
            className="mt-6 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-bold text-white"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>

        <h1 className="text-2xl font-black text-gray-900">
          Payment Successful
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Your payment has been verified successfully.
        </p>

        <Link
          href="/dashboard/user"
          className="mt-6 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-bold text-white"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}