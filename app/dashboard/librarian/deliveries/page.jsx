"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiTruck,
  FiCheck,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiX,
  FiArrowRight,
  FiRefreshCw,
} from "react-icons/fi";

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // =====================================================
  // LOAD DELIVERIES
  // =====================================================
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

      setDeliveries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("LOAD DELIVERIES ERROR:", error);

      setToast(
        error.message || "Failed to load deliveries"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  // =====================================================
  // TOAST
  // =====================================================
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [toast]);

  // =====================================================
  // STATUS COUNTS
  // =====================================================
  const stats = useMemo(() => {
    return {
      total: deliveries.length,

      pending: deliveries.filter(
        (item) => item.status === "Pending"
      ).length,

      approved: deliveries.filter(
        (item) => item.status === "Approved"
      ).length,

      out: deliveries.filter(
        (item) => item.status === "Out for Delivery"
      ).length,

      delivered: deliveries.filter(
        (item) => item.status === "Delivered"
      ).length,
    };
  }, [deliveries]);

  // =====================================================
  // UPDATE DELIVERY STATUS
  // =====================================================
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

  // =====================================================
  // STATUS STYLE
  // =====================================================
  const getStatusConfig = (status) => {
    switch (status) {
      case "Pending":
        return {
          label: "Pending",
          bg: "bg-[#fcc615]/10",
          text: "text-[#9b7300]",
          iconBg: "bg-[#fcc615]/15",
          iconText: "text-[#a57b00]",
          accent: "bg-[#fcc615]",
          icon: FiClock,
        };

      case "Approved":
        return {
          label: "Approved",
          bg: "bg-blue-50",
          text: "text-blue-600",
          iconBg: "bg-blue-50",
          iconText: "text-blue-600",
          accent: "bg-blue-500",
          icon: FiCheck,
        };

      case "Out for Delivery":
        return {
          label: "On Way",
          bg: "bg-black",
          text: "text-white",
          iconBg: "bg-[#fcc615]",
          iconText: "text-black",
          accent: "bg-black",
          icon: FiTruck,
        };

      case "Delivered":
        return {
          label: "Delivered",
          bg: "bg-emerald-50",
          text: "text-emerald-600",
          iconBg: "bg-emerald-50",
          iconText: "text-emerald-600",
          accent: "bg-emerald-500",
          icon: FiCheckCircle,
        };

      default:
        return {
          label: status || "Unknown",
          bg: "bg-gray-100",
          text: "text-gray-600",
          iconBg: "bg-gray-100",
          iconText: "text-gray-500",
          accent: "bg-gray-400",
          icon: FiPackage,
        };
    }
  };

  // =====================================================
  // ACTION BUTTON
  // =====================================================
  const renderAction = (
    delivery,
    bookTitle,
    isUpdating
  ) => {
    const status = delivery.status;

    if (status === "Pending") {
      return (
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
          className="inline-flex items-center gap-1.5 rounded-lg bg-black px-3 py-2 text-[8px] font-black text-white transition-all hover:bg-[#fc1d15] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUpdating ? (
            <FiRefreshCw className="h-3 w-3 animate-spin" />
          ) : (
            <FiCheck className="h-3 w-3" />
          )}

          {isUpdating ? "Updating" : "Approve"}
        </button>
      );
    }

    if (status === "Approved") {
      return (
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
          className="inline-flex items-center gap-1.5 rounded-lg bg-black px-3 py-2 text-[8px] font-black text-white transition-all hover:bg-[#fc1d15] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUpdating ? (
            <FiRefreshCw className="h-3 w-3 animate-spin" />
          ) : (
            <FiTruck className="h-3 w-3" />
          )}

          {isUpdating
            ? "Updating"
            : "Start Delivery"}
        </button>
      );
    }

    if (status === "Out for Delivery") {
      return (
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
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[8px] font-black text-gray-600 transition-all hover:border-emerald-500 hover:bg-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUpdating ? (
            <FiRefreshCw className="h-3 w-3 animate-spin" />
          ) : (
            <FiCheckCircle className="h-3 w-3" />
          )}

          {isUpdating ? "Updating" : "Mark Delivered"}
        </button>
      );
    }

    if (status === "Delivered") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-[8px] font-black text-emerald-600">
          <FiCheckCircle className="h-3 w-3" />
          Completed
        </span>
      );
    }

    return null;
  };

  return (
    <main className="relative min-h-full overflow-hidden bg-[#ffeec3] px-3 py-4 sm:px-5 sm:py-5">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}
      <div className="pointer-events-none absolute -left-24 top-0 h-48 w-48 rounded-full bg-[#fc1d15]/[0.035] blur-3xl" />

      <div className="pointer-events-none absolute -right-24 top-0 h-56 w-56 rounded-full bg-[#fcc615]/[0.06] blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        {/* =====================================================
            HEADER
        ====================================================== */}
        <section className="border-b border-black/[0.06] pb-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="mb-1.5 flex items-center gap-1.5">
                <span className="h-1 w-5 rounded-full bg-[#fc1d15]" />

                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#fc1d15]">
                  Delivery Center
                </span>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-black sm:text-3xl">
                Book{" "}
                <span className="text-[#fc1d15]">
                  Deliveries
                </span>
              </h1>

              <p className="mt-1 text-[10px] text-gray-400">
                Manage and track all delivery requests.
              </p>
            </div>

            <button
              type="button"
              onClick={loadDeliveries}
              disabled={loading}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-black/[0.07] bg-white text-gray-400 transition hover:border-[#fc1d15]/20 hover:bg-[#fc1d15] hover:text-white disabled:opacity-50"
              title="Refresh"
            >
              <FiRefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""
                  }`}
              />
            </button>
          </div>
        </section>

        {/* =====================================================
            STATS
        ====================================================== */}
        <section className="grid grid-cols-2 gap-2 py-4 sm:grid-cols-4">
          {/* Total */}
          <div className="group rounded-xl border border-black/[0.06] bg-white p-2.5 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fc1d15]/10 text-[#fc1d15]">
                <FiPackage className="h-3.5 w-3.5" />
              </div>

              <span className="text-lg font-black text-black">
                {stats.total}
              </span>
            </div>

            <p className="mt-2 text-[8px] font-black uppercase tracking-wider text-gray-400">
              Total
            </p>
          </div>

          {/* Pending */}
          <div className="group rounded-xl border border-black/[0.06] bg-white p-2.5 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fcc615]/15 text-[#a57b00]">
                <FiClock className="h-3.5 w-3.5" />
              </div>

              <span className="text-lg font-black text-black">
                {stats.pending}
              </span>
            </div>

            <p className="mt-2 text-[8px] font-black uppercase tracking-wider text-gray-400">
              Pending
            </p>
          </div>

          {/* On Way */}
          <div className="group rounded-xl border border-black/[0.06] bg-white p-2.5 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                <FiTruck className="h-3.5 w-3.5" />
              </div>

              <span className="text-lg font-black text-black">
                {stats.out}
              </span>
            </div>

            <p className="mt-2 text-[8px] font-black uppercase tracking-wider text-gray-400">
              On Way
            </p>
          </div>

          {/* Completed */}
          <div className="rounded-xl bg-black p-2.5 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fcc615] text-black">
                <FiCheckCircle className="h-3.5 w-3.5" />
              </div>

              <span className="text-lg font-black text-white">
                {stats.delivered}
              </span>
            </div>

            <p className="mt-2 text-[8px] font-black uppercase tracking-wider text-gray-500">
              Completed
            </p>
          </div>
        </section>

        {/* =====================================================
            DELIVERY LIST HEADER
        ====================================================== */}
        <section>
          <div className="mb-2.5 flex items-end justify-between">
            <div>
              <h2 className="text-sm font-black text-black">
                Delivery Requests
              </h2>

              <p className="mt-0.5 text-[9px] text-gray-400">
                {loading
                  ? "Loading requests..."
                  : `${deliveries.length} total requests`}
              </p>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-white px-2 py-1 text-[7px] font-black text-gray-400 shadow-sm ring-1 ring-black/[0.05]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </div>
          </div>

          {/* =====================================================
              LOADING
          ====================================================== */}
          {loading ? (
            <div className="grid gap-2.5 md:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-[112px] animate-pulse rounded-xl border border-black/[0.06] bg-white"
                />
              ))}
            </div>
          ) : deliveries.length === 0 ? (
            /* =====================================================
                EMPTY
            ====================================================== */
            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-300">
                <FiPackage className="h-5 w-5" />
              </div>

              <p className="mt-3 text-[11px] font-black text-gray-600">
                No delivery requests
              </p>

              <p className="mt-1 text-[9px] text-gray-400">
                New paid orders will appear here.
              </p>
            </div>
          ) : (
            /* =====================================================
                DELIVERY CARDS
            ====================================================== */
            <div className="grid gap-2.5 md:grid-cols-2">
              {deliveries.map((delivery, index) => {
                const status = delivery.status;

                const config =
                  getStatusConfig(status);

                const StatusIcon = config.icon;

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
                    className="group relative overflow-hidden rounded-xl border border-black/[0.06] bg-white p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/[0.1] hover:shadow-lg"
                    style={{
                      animation: `deliveryCardIn .35s ease-out ${index * 60
                        }ms both`,
                    }}
                  >
                    {/* Top accent */}
                    <div
                      className={`absolute left-0 top-0 h-[2px] w-full ${config.accent}`}
                    />

                    <div className="flex gap-3">
                      {/* =================================================
                          ICON
                      ================================================== */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconBg} ${config.iconText} transition-transform duration-300 group-hover:scale-105`}
                      >
                        <StatusIcon className="h-4 w-4" />
                      </div>

                      {/* =================================================
                          CONTENT
                      ================================================== */}
                      <div className="min-w-0 flex-1">
                        {/* Top */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="mb-0.5 text-[7px] font-black uppercase tracking-[0.14em] text-gray-300">
                              Delivery Request
                            </p>

                            <h3 className="truncate text-[12px] font-black text-gray-900">
                              {bookTitle}
                            </h3>

                            <p className="mt-0.5 truncate text-[8px] text-gray-400">
                              Customer:{" "}
                              <span className="font-bold text-gray-500">
                                {customer}
                              </span>
                            </p>
                          </div>

                          {/* Status */}
                          <span
                            className={`shrink-0 rounded-full px-2 py-1 text-[7px] font-black ${config.bg} ${config.text}`}
                          >
                            {config.label}
                          </span>
                        </div>

                        {/* Meta */}
                        <div className="mt-2 flex items-center gap-2">
                          {delivery.quantity && (
                            <span className="rounded-md bg-gray-50 px-1.5 py-1 text-[7px] font-bold text-gray-400">
                              Qty:{" "}
                              <span className="text-gray-600">
                                {delivery.quantity}
                              </span>
                            </span>
                          )}

                          {delivery.deliveryFee !==
                            undefined && (
                              <span className="rounded-md bg-gray-50 px-1.5 py-1 text-[7px] font-bold text-gray-400">
                                Fee:{" "}
                                <span className="text-gray-600">
                                  ₹
                                  {
                                    delivery.deliveryFee
                                  }
                                </span>
                              </span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="mt-2.5 flex items-center gap-1.5">
                          {renderAction(
                            delivery,
                            bookTitle,
                            isUpdating
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              setToast(
                                `Viewing "${bookTitle}"`
                              )
                            }
                            className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-all hover:border-[#fcc615] hover:bg-[#fcc615] hover:text-black"
                            title="View delivery"
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
        </section>
      </div>

      {/* =====================================================
          TOAST
      ====================================================== */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-xs -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-xl bg-black px-3 py-2.5 text-white shadow-[0_12px_35px_rgba(0,0,0,0.2)]">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fcc615] text-black">
              <FiCheckCircle className="h-3.5 w-3.5" />
            </div>

            <p className="min-w-0 flex-1 truncate text-[9px] font-bold">
              {toast}
            </p>

            <button
              type="button"
              onClick={() => setToast("")}
              className="text-gray-400 transition hover:text-white"
            >
              <FiX className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
