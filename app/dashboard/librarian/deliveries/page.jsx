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

const deliveries = [
  {
    id: 1,
    book: "The Great Gatsby",
    customer: "Rahim Ahmed",
    status: "Pending",
  },
  {
    id: 2,
    book: "Clean Code",
    customer: "Karim Hasan",
    status: "Out for Delivery",
  },
];

export default function DeliveriesPage() {
  const [toast, setToast] = useState("");

  const handleAction = (message) => {
    setToast(message);
  };

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 2200);

    return () => clearTimeout(timer);
  }, [toast]);

  const pendingCount = deliveries.filter(
    (item) => item.status === "Pending"
  ).length;

  const outCount = deliveries.filter(
    (item) => item.status === "Out for Delivery"
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
            Book <span className="text-[#fc1d15]">Deliveries</span>
          </h1>

          <p className="mt-1 text-[11px] text-gray-400">
            Manage book delivery requests.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-2">
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

          <div className="space-y-2.5">
            {deliveries.map((delivery, index) => {
              const isPending = delivery.status === "Pending";

              return (
                <article
                  key={delivery.id}
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
                        : "bg-emerald-500"
                    }`}
                  />

                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isPending
                          ? "bg-[#fcc615]/15 text-[#a57b00]"
                          : "bg-emerald-50 text-emerald-600"
                      } transition-transform duration-300 group-hover:scale-105`}
                    >
                      {isPending ? (
                        <FiClock className="h-4 w-4" />
                      ) : (
                        <FiTruck className="h-4 w-4" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate text-[12px] font-black text-gray-900">
                            {delivery.book}
                          </h3>

                          <p className="mt-0.5 truncate text-[9px] text-gray-400">
                            Customer:{" "}
                            <span className="font-semibold text-gray-500">
                              {delivery.customer}
                            </span>
                          </p>
                        </div>

                        {/* Status */}
                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[7px] font-black ${
                            isPending
                              ? "bg-[#fcc615]/15 text-[#9b7300]"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {delivery.status}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-2.5 flex items-center gap-1.5">
                        {isPending && (
                          <button
                            type="button"
                            onClick={() =>
                              handleAction(
                                `"${delivery.book}" approved successfully`
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-lg bg-black px-2.5 py-1.5 text-[8px] font-black text-white transition-all duration-300 hover:bg-[#fc1d15]"
                          >
                            <FiCheck className="h-2.5 w-2.5" />
                            Approve
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleAction(
                              `"${delivery.book}" marked as delivered`
                            )
                          }
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[8px] font-black text-gray-600 transition-all duration-300 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white"
                        >
                          <FiCheckCircle className="h-2.5 w-2.5" />
                          Delivered
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleAction(`Viewing "${delivery.book}"`)
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
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-xs -translate-x-1/2 animate-[deliveryToast_.25s_ease-out]">
          <div className="flex items-center gap-2 rounded-xl bg-black px-3 py-2.5 text-white shadow-lg">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fcc615] text-black">
              <FiCheckCircle className="h-3.5 w-3.5" />
            </div>

            <p className="text-[9px] font-bold">{toast}</p>

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