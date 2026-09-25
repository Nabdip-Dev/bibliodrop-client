"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiBookOpen,
  FiTruck,
  FiClock,
  FiPlus,
  FiArrowUpRight,
  FiPackage,
  FiLayers,
  FiActivity,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";

export default function LibrarianDashboard() {
  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  const stats = [
    {
      label: "Total Books",
      value: "0",
      icon: FiBookOpen,
      iconBg: "bg-[#fc1d15]/10",
      iconColor: "text-[#fc1d15]",
      accent: "from-[#fc1d15] to-[#ff6b63]",
    },
    {
      label: "Available",
      value: "0",
      icon: FiCheckCircle,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      accent: "from-emerald-500 to-emerald-300",
    },
    {
      label: "Deliveries",
      value: "0",
      icon: FiTruck,
      iconBg: "bg-[#fcc615]/20",
      iconColor: "text-[#c28f00]",
      accent: "from-[#fcc615] to-[#ffe477]",
    },
    {
      label: "Pending",
      value: "0",
      icon: FiClock,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      accent: "from-orange-500 to-orange-300",
    },
  ];

  const actions = [
    {
      title: "Add Book",
      description: "Add a new book to your library inventory.",
      href: "/dashboard/librarian/add-book",
      icon: FiPlus,
      iconBg: "bg-[#fc1d15]",
      iconColor: "text-white",
      tag: "Inventory",
    },
    {
      title: "Manage Books",
      description: "View, update and manage your existing books.",
      href: "/dashboard/librarian/books",
      icon: FiLayers,
      iconBg: "bg-[#fcc615]",
      iconColor: "text-black",
      tag: "Library",
    },
    {
      title: "Manage Deliveries",
      description: "View and update delivery requests.",
      href: "/dashboard/librarian/deliveries",
      icon: FiTruck,
      iconBg: "bg-black",
      iconColor: "text-white",
      tag: "Requests",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffdf8] px-4 py-6 sm:px-6">
      {/* Background */}
      <div className="pointer-events-none absolute -left-28 top-20 h-64 w-64 rounded-full bg-[#fc1d15]/[0.045] blur-3xl" />

      <div className="pointer-events-none absolute -right-28 top-0 h-72 w-72 rounded-full bg-[#fcc615]/[0.09] blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#fc1d15]/[0.025] blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-7 rounded-full bg-[#fc1d15]" />

              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#fc1d15]">
                Librarian Panel
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
              Librarian{" "}
              <span className="text-[#fc1d15]">Dashboard</span>
            </h1>

            <p className="mt-1.5 text-sm text-gray-500">
              Manage your library, books and deliveries.
            </p>
          </div>

          <Link
            href="/dashboard/librarian/add-book"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-bold text-white shadow-[4px_4px_0_#fcc615] transition-all duration-300 hover:-translate-y-1 hover:bg-[#fc1d15] hover:shadow-[5px_5px_0_#fcc615]"
          >
            <FiPlus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            Add Book
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)]"
                style={{
                  animation: `dashboardCardIn .5s ease-out ${
                    index * 80
                  }ms both`,
                }}
              >
                {/* Top accent */}
                <div
                  className={`absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r ${stat.accent}`}
                />

                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <FiActivity className="h-4 w-4 text-gray-200 transition-colors duration-300 group-hover:text-[#fc1d15]" />
                </div>

                <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {stat.label}
                </p>

                <h2 className="mt-0.5 text-2xl font-black text-black">
                  {stat.value}
                </h2>
              </div>
            );
          })}
        </div>

        {/* Main Actions */}
        <div className="mt-7">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-black text-black">
                Quick Actions
              </h2>

              <p className="mt-0.5 text-xs text-gray-400">
                Manage your library faster.
              </p>
            </div>

            <FiPackage className="h-5 w-5 text-[#fc1d15]" />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {actions.map((action, index) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  onClick={() => showToast(`${action.title} opened`)}
                  className="group relative overflow-hidden rounded-[20px] border border-black/[0.06] bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
                  style={{
                    animation: `dashboardCardIn .55s ease-out ${
                      350 + index * 100
                    }ms both`,
                  }}
                >
                  {/* Hover Glow */}
                  <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#fcc615]/10 blur-2xl transition-transform duration-700 group-hover:scale-150" />

                  <div className="relative flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${action.iconBg} ${action.iconColor} shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:rotate-3`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.07] text-gray-400 transition-all duration-300 group-hover:border-[#fc1d15] group-hover:bg-[#fc1d15] group-hover:text-white">
                      <FiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>

                  <div className="relative mt-5">
                    <span className="rounded-full bg-gray-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-gray-400">
                      {action.tag}
                    </span>

                    <h3 className="mt-3 text-base font-black text-black transition-colors duration-300 group-hover:text-[#fc1d15]">
                      {action.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {action.description}
                    </p>
                  </div>

                  <div className="relative mt-5 h-[2px] w-0 rounded-full bg-gradient-to-r from-[#fc1d15] to-[#fcc615] transition-all duration-500 group-hover:w-16" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-5 overflow-hidden rounded-[20px] border border-black/[0.06] bg-black p-4 shadow-[0_10px_35px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fcc615] text-black">
                <FiBookOpen className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-bold text-white">
                  Library Overview
                </p>

                <p className="mt-0.5 text-[10px] text-gray-400">
                  Your library statistics will appear here.
                </p>
              </div>
            </div>

            <span className="w-fit rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold text-[#fcc615]">
              BiblioDrop
            </span>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-32px)] max-w-xs -translate-x-1/2 animate-[dashboardToast_.3s_ease-out]">
          <div className="flex items-center gap-3 rounded-2xl bg-black px-3.5 py-3 text-white shadow-[0_15px_45px_rgba(0,0,0,0.2)]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#fcc615] text-black">
              <FiCheckCircle className="h-4 w-4" />
            </div>

            <p className="text-[11px] font-semibold">
              {toast}
            </p>

            <button
              type="button"
              onClick={() => setToast("")}
              className="ml-auto text-gray-400 transition hover:text-white"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}