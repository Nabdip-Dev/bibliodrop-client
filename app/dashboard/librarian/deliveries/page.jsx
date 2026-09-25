"use client";

import { useEffect, useState } from "react";
import {
  FiTruck,
  FiCheck,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiX,
  FiArrowRight,
} from "react-icons/fi";

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // =========================
  // LOAD REAL DELIVERIES
  // =========================
  const loadDeliveries = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/deliveries",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load deliveries"
        );
      }

      setDeliveries(data);
    } catch (error) {
      console.error("LOAD DELIVERIES ERROR:", error);
      setToast(error.message || "Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  // =========================
  // TOAST
  // =========================
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 2200);

    return () => clearTimeout(timer);
  }, [toast]);

  // =========================
  // UPDATE DELIVERY STATUS
  // =========================
  const updateDeliveryStatus = async (
    deliveryId,
    newStatus,
    bookTitle
  ) => {
    try {
      setUpdatingId(deliveryId);
      setToast("");

      const response = await fetch(
        `http://localhost:5000/deliveries/${deliveryId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update delivery"
        );
      }

      // Update UI immediately
      setDeliveries((currentDeliveries) =>
        currentDeliveries.map((delivery) =>
          delivery._id === deliveryId
            ? {
                ...delivery,
                status: newStatus,
              }
            : delivery
        )
      );

      setToast(
        `"${bookTitle}" → ${newStatus}`
      );
    } catch (error) {
      console.error(
        "UPDATE DELIVERY STATUS ERROR:",
        error
      );

      setToast(
        error.message ||
          "Failed to update delivery status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // STATUS COUNTS
  // =========================
  const pendingCount = deliveries.filter(
    (item) => item.status === "Pending"
  ).length;

  const outCount = deliveries.filter(
    (item) =>
      item.status === "Out for Delivery"
  ).length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffdf8] px-3 py-5 sm:px-5">
      {/* Background */}
      <div className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-[#fc1d15]/[0.04] blur-3xl" />

      <div className="pointer-events-none absolute -right-20 top-0 h-48 w-48 rounded-full bg-[#fcc615]/[0.07] blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <div>
          <div className="mb-1 flex items-center gap-1.5">
            <span className="h-1 w-5 rounded-full bg-[#fc1d15]" />

            <span className="text-[8px] font-black uppercase tracking-[0.18em] text-[#fc1d15]">
              Delivery Center
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-black sm:text-3xl">
            Book{" "}
            <span className="text-[#fc1d15]">
              Deliveries
            </span>
          </h1>

          <p className="mt-1 text-[11px] text-gray-400">
            Manage book delivery requests.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {/* Total */}
          <div className="rounded-xl border border-black/[0.06] bg-white p-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fc1d15]/10 text-[#fc1d15]">
                <FiPackage className="h-3.5 w-3.5" />
              </div>

              <span className="text-lg font-black text-black">
                {deliveries.length}
              </span>
            </div>

            <p className="mt-2 text-[8px] font-black uppercase tracking-wider text-gray-400">
              Total
            </p>
          </div>

          {/* Pending */}
          <div className="rounded-xl border border-black/[0.06] bg-white p-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fcc615]/20 text-[#a57b00]">
                <FiClock className="h-3.5 w-3.5" />
              </div>

              <span className="text-lg font-black text-black">
                {pendingCount}
              </span>
            </div>

            <p className="mt-2 text-[8px] font-black uppercase tracking-wider text-gray-400">
              Pending
            </p>
          </div>

          {/* Out for Delivery */}
          <div className="rounded-xl bg-black p-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fcc615] text-black">
                <FiTruck className="h-3.5 w-3.5" />
              </div>

              <span className="text-lg font-black text-white">
                {outCount}
              </span>
            </div>

            <p className="mt-2 text-[8px] font-black uppercase tracking-wider text-gray-500">
              On Way
            </p>
          </div>
        </div>

        {/* Delivery List */}
        <div className="mt-5">
          <div className="mb-2.5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-black">
                Delivery Requests
              </h2>

              <p className="text-[9px] text-gray-400">
                {deliveries.length} requests
              </p>
            </div>

            <FiTruck className="h-4 w-4 text-[#fc1d15]" />
          </div>

          {/* Loading */}
          {loading ? (
            <div className="rounded-[15px] border border-black/[0.06] bg-white p-8 text-center shadow-sm">
              <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-black" />

              <p className="mt-3 text-[10px] font-semibold text-gray-400">
                Loading deliveries...
              </p>
            </div>
          ) : deliveries.length === 0 ? (
            /* Empty */
            <div className="rounded-[15px] border border-black/[0.06] bg-white p-8 text-center shadow-sm">
              <FiPackage className="mx-auto h-8 w-8 text-gray-300" />

              <p className="mt-3 text-[11px] font-black text-gray-500">
                No delivery requests yet.
              </p>

              <p className="mt-1 text-[9px] text-gray-400">
                New paid orders will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {deliveries.map((delivery, index) => {
                const status = delivery.status;

                const isPending =
                  status === "Pending";

                const isApproved =
                  status === "Approved";

                const isOutForDelivery =
                  status === "Out for Delivery";

                const isDelivered =
                  status === "Delivered";

                const bookTitle =
                  delivery.bookTitle ||
                  "Book Delivery";

                const customer =
                  delivery.customerName ||
                  delivery.userName ||
                  delivery.customer ||
                  delivery.userId ||
                  "Customer";

                const isUpdating =
                  updatingId === delivery._id;

                return (
                  <article
                    key={delivery._id}
                    className="group relative overflow-hidden rounded-[15px] border border-black/[0.06] bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    style={{
                      animation: `deliveryCardIn .4s ease-out ${
                        index * 80
                      }ms both`,
                    }}
                  >
                    {/* Accent */}
                    <div
                      className={`absolute left-0 top-0 h-0.5 w-full ${
                        isPending
                          ? "bg-gradient-to-r from-[#fcc615] to-[#fc1d15]"
                          : isDelivered
                          ? "bg-emerald-500"
                          : "bg-black"
                      }`}
                    />

                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isPending
                            ? "bg-[#fcc615]/15 text-[#a57b00]"
                            : isDelivered
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-gray-100 text-gray-700"
                        } transition-transform duration-300 group-hover:scale-105`}
                      >
                        {isPending ? (
                          <FiClock className="h-4 w-4" />
                        ) : isDelivered ? (
                          <FiCheckCircle className="h-4 w-4" />
                        ) : (
                          <FiTruck className="h-4 w-4" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate text-[12px] font-black text-gray-900">
                              {bookTitle}
                            </h3>

                            <p className="mt-0.5 truncate text-[9px] text-gray-400">
                              Customer:{" "}
                              <span className="font-semibold text-gray-500">
                                {customer}
                              </span>
                            </p>

                            {delivery.quantity && (
                              <p className="mt-0.5 text-[8px] text-gray-400">
                                Quantity:{" "}
                                {delivery.quantity}
                              </p>
                            )}
                          </div>

                          {/* Status */}
                          <span
                            className={`shrink-0 rounded-full px-2 py-1 text-[7px] font-black ${
                              isPending
                                ? "bg-[#fcc615]/15 text-[#9b7300]"
                                : isDelivered
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {status}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="mt-2.5 flex items-center gap-1.5">
                          {/* Pending → Approved */}
                          {isPending && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() =>
                                updateDeliveryStatus(
                                  delivery._id,
                                  "Approved",
                                  bookTitle
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-black px-2.5 py-1.5 text-[8px] font-black text-white transition-all duration-300 hover:bg-[#fc1d15] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <FiCheck className="h-2.5 w-2.5" />

                              {isUpdating
                                ? "Updating..."
                                : "Approve"}
                            </button>
                          )}

                          {/* Approved → Out for Delivery */}
                          {isApproved && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() =>
                                updateDeliveryStatus(
                                  delivery._id,
                                  "Out for Delivery",
                                  bookTitle
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-black px-2.5 py-1.5 text-[8px] font-black text-white transition-all duration-300 hover:bg-[#fc1d15] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <FiTruck className="h-2.5 w-2.5" />

                              {isUpdating
                                ? "Updating..."
                                : "Start Delivery"}
                            </button>
                          )}

                          {/* Out for Delivery → Delivered */}
                          {isOutForDelivery && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() =>
                                updateDeliveryStatus(
                                  delivery._id,
                                  "Delivered",
                                  bookTitle
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[8px] font-black text-gray-600 transition-all duration-300 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <FiCheckCircle className="h-2.5 w-2.5" />

                              {isUpdating
                                ? "Updating..."
                                : "Delivered"}
                            </button>
                          )}

                          {/* Delivered */}
                          {isDelivered && (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[8px] font-black text-emerald-600">
                              <FiCheckCircle className="h-2.5 w-2.5" />
                              Completed
                            </span>
                          )}

                          {/* View */}
                          <button
                            type="button"
                            onClick={() =>
                              setToast(
                                `Viewing "${bookTitle}"`
                              )
                            }
                            className="ml-auto flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition-all duration-300 hover:border-[#fcc615] hover:bg-[#fcc615] hover:text-black"
                          >
                            <FiArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-xs -translate-x-1/2 animate-[deliveryToast_.25s_ease-out]">
          <div className="flex items-center gap-2 rounded-xl bg-black px-3 py-2.5 text-white shadow-lg">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fcc615] text-black">
              <FiCheckCircle className="h-3.5 w-3.5" />
            </div>

            <p className="text-[9px] font-bold">
              {toast}
            </p>

            <button
              type="button"
              onClick={() => setToast("")}
              className="ml-auto text-gray-400 transition hover:text-white"
            >
              <FiX className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}