"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const {
    data: session,
    isPending,
  } = authClient.useSession();

  const user = session?.user;

  // First name
  const firstName =
    user?.name?.trim().split(/\s+/)[0] ||
    user?.email?.split("@")[0] ||
    "User";

  // 3 letter initials
  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 3)
      .toUpperCase() ||
    firstName.slice(0, 3).toUpperCase();

  // Role title
  // user.role থাকলে সেটা ব্যবহার করবে
  const role = user?.role?.toLowerCase();

  const roleTitle =
    role === "librarian"
      ? "LB"
      : "US";

  const roleName =
    role === "librarian"
      ? "Librarian"
      : "User";

  // Logout
  const handleLogout = async () => {
    await authClient.signOut();

    setProfileOpen(false);
    setOpen(false);

    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="border-b border-black/10 bg-[#fcc615] shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

          {/* ================= LOGO ================= */}
          <Link
            href="/"
            className="group flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0_#111] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[5px_6px_0_#111]">
              <svg
                viewBox="0 0 48 48"
                className="h-7 w-7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 9.5C10 7.567 11.567 6 13.5 6H35v31H13.5A3.5 3.5 0 0 0 10 40.5V9.5Z"
                  fill="#fc1d15"
                  stroke="#111"
                  strokeWidth="2.5"
                />
                <path
                  d="M35 6H13.5A3.5 3.5 0 0 0 10 9.5v31A3.5 3.5 0 0 1 13.5 37H35V6Z"
                  fill="#fff"
                  stroke="#111"
                  strokeWidth="2.5"
                />
                <path
                  d="M17 14h12M17 20h12M17 26h8"
                  stroke="#111"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="leading-none">
              <div className="text-[22px] font-black tracking-tight text-black">
                Biblio<span className="text-[#fc1d15]">Drop</span>
              </div>

              <p className="mt-1 hidden text-[9px] font-bold uppercase tracking-[0.22em] text-black/60 sm:block">
                Your Local Library
              </p>
            </div>
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <div className="hidden items-center gap-2 lg:flex">

            <Link
              href="/"
              className="group relative rounded-xl px-4 py-2.5 text-sm font-extrabold text-black transition-all duration-300 hover:bg-white/60"
            >
              Home
              <span className="absolute bottom-1 left-4 right-4 h-[2px] origin-left scale-x-0 rounded-full bg-[#fc1d15] transition-transform duration-300 group-hover:scale-x-100" />
            </Link>

            <Link
              href="/browse-books"
              className="group relative rounded-xl px-4 py-2.5 text-sm font-extrabold text-black transition-all duration-300 hover:bg-white/60"
            >
              Browse Books
              <span className="absolute bottom-1 left-4 right-4 h-[2px] origin-left scale-x-0 rounded-full bg-[#fc1d15] transition-transform duration-300 group-hover:scale-x-100" />
            </Link>

            <Link
              href="/dashboard"
              className="group relative rounded-xl px-4 py-2.5 text-sm font-extrabold text-black transition-all duration-300 hover:bg-white/60"
            >
              Dashboard
              <span className="absolute bottom-1 left-4 right-4 h-[2px] origin-left scale-x-0 rounded-full bg-[#fc1d15] transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="hidden items-center gap-3 lg:flex">

            {!isPending && !user && (
              <>
                {/* LOGIN */}
                <Link
                  href="/login"
                  className="group relative rounded-xl border-2 border-black bg-white px-5 py-2.5 text-sm font-black text-black shadow-[4px_4px_0_#111] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#111]"
                >
                  Login
                </Link>

                {/* REGISTER */}
                <Link
                  href="/register"
                  className="group relative rounded-xl border-2 border-black bg-[#fc1d15] px-5 py-2.5 text-sm font-black text-white shadow-[4px_4px_0_#111] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e91912] hover:shadow-[5px_5px_0_#111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#111]"
                >
                  Register
                </Link>
              </>
            )}

            {/* ================= USER PROFILE ================= */}
            {!isPending && user && (
              <div className="relative">

                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 rounded-2xl border-2 border-black bg-white px-2.5 py-2 shadow-[4px_4px_0_#111] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#111] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_#111]"
                >
                  {/* Avatar */}
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-black bg-[#f7f4ec]">

                    {user.image ? (
                      <img
                        src={user.image}
                        alt={firstName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        viewBox="0 0 48 48"
                        className="h-7 w-7"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="24"
                          cy="17"
                          r="8"
                          fill="#fcc615"
                          stroke="#111"
                          strokeWidth="2.5"
                        />

                        <path
                          d="M10 40c1.8-8.2 7-12 14-12s12.2 3.8 14 12"
                          fill="#fc1d15"
                          stroke="#111"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </div>

                  {/* User info */}
                  <div className="hidden text-left sm:block">
                    <div className="max-w-[120px] truncate text-sm font-black text-black">
                      {firstName}
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-wider text-black/50">
                      {roleName}
                    </div>
                  </div>

                  {/* 3 Letter Initial */}
                  <div className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-black px-1.5 text-[10px] font-black tracking-wide text-[#fcc615]">
                    {initials}
                  </div>

                  {/* 2 Letter Role */}
                  <div className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-black bg-[#fcc615] px-1.5 text-[10px] font-black text-black">
                    {roleTitle}
                  </div>

                  {/* Arrow */}
                  <svg
                    viewBox="0 0 20 20"
                    className={`h-4 w-4 text-black transition-transform duration-300 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="m5 7 5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* ================= DROPDOWN ================= */}
                {profileOpen && (
                  <div className="profile-dropdown absolute right-0 top-[calc(100%+12px)] w-64 overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[6px_7px_0_#111]">

                    {/* Profile Header */}
                    <div className="border-b border-black/10 bg-[#fffaf0] p-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border-2 border-black bg-[#f7f4ec]">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={firstName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <svg
                              viewBox="0 0 48 48"
                              className="h-8 w-8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                cx="24"
                                cy="17"
                                r="8"
                                fill="#fcc615"
                                stroke="#111"
                                strokeWidth="2.5"
                              />

                              <path
                                d="M10 40c1.8-8.2 7-12 14-12s12.2 3.8 14 12"
                                fill="#fc1d15"
                                stroke="#111"
                                strokeWidth="2.5"
                              />
                            </svg>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-black">
                            {user.name || firstName}
                          </p>

                          <p className="truncate text-xs font-medium text-black/50">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Dropdown Links */}
                    <div className="p-2">

                      {/* Profile Settings */}
                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-black transition-all duration-200 hover:bg-[#fff4cc] hover:translate-x-1"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fcc615]">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="12"
                              cy="8"
                              r="3.5"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            />
                            <path
                              d="M5 20c.8-4 3-6 7-6s6.2 2 7 6"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>

                        <span>Profile Settings</span>
                      </Link>

                      {/* Dashboard */}
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-black transition-all duration-200 hover:bg-[#fff4cc] hover:translate-x-1"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fc1d15] text-white">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="4"
                              y="4"
                              width="6"
                              height="6"
                              rx="1"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            />
                            <rect
                              x="14"
                              y="4"
                              width="6"
                              height="6"
                              rx="1"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            />
                            <rect
                              x="4"
                              y="14"
                              width="6"
                              height="6"
                              rx="1"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            />
                            <rect
                              x="14"
                              y="14"
                              width="6"
                              height="6"
                              rx="1"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            />
                          </svg>
                        </span>

                        <span>Dashboard</span>
                      </Link>

                      {/* Logout */}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-[#fc1d15] transition-all duration-200 hover:bg-red-50 hover:translate-x-1"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />

                            <path
                              d="M14 8l4 4-4 4"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />

                            <path
                              d="M9 12h9"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>

                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ================= MOBILE BUTTON ================= */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black bg-white shadow-[3px_3px_0_#111] transition-all duration-200 hover:-translate-y-0.5 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? (
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
              >
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {open && (
          <div className="border-t-2 border-black/10 bg-[#fcc615] px-5 pb-5 pt-3 lg:hidden">
            <div className="mx-auto max-w-7xl">

              <div className="space-y-2">

                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl border-2 border-black/10 bg-white/70 px-4 py-3 text-sm font-black text-black transition-all hover:bg-white"
                >
                  Home
                </Link>

                <Link
                  href="/browse-books"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl border-2 border-black/10 bg-white/70 px-4 py-3 text-sm font-black text-black transition-all hover:bg-white"
                >
                  Browse Books
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl border-2 border-black/10 bg-white/70 px-4 py-3 text-sm font-black text-black transition-all hover:bg-white"
                >
                  Dashboard
                </Link>

                {!isPending && !user && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="rounded-xl border-2 border-black bg-white px-4 py-3 text-center text-sm font-black text-black shadow-[3px_3px_0_#111] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#111]"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="rounded-xl border-2 border-black bg-[#fc1d15] px-4 py-3 text-center text-sm font-black text-white shadow-[3px_3px_0_#111] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#111]"
                    >
                      Register
                    </Link>
                  </div>
                )}

                {!isPending && user && (
                  <div className="mt-3 rounded-2xl border-2 border-black bg-white p-3 shadow-[4px_4px_0_#111]">

                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-black bg-[#f7f4ec]">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={firstName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <svg
                            viewBox="0 0 48 48"
                            className="h-8 w-8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="24"
                              cy="17"
                              r="8"
                              fill="#fcc615"
                              stroke="#111"
                              strokeWidth="2.5"
                            />

                            <path
                              d="M10 40c1.8-8.2 7-12 14-12s12.2 3.8 14 12"
                              fill="#fc1d15"
                              stroke="#111"
                              strokeWidth="2.5"
                            />
                          </svg>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black">
                          {firstName}
                        </p>

                        <p className="truncate text-xs text-black/50">
                          {roleName}
                        </p>
                      </div>

                      <div className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-black px-1.5 text-[10px] font-black text-[#fcc615]">
                        {initials}
                      </div>

                      <div className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-black bg-[#fcc615] px-1.5 text-[10px] font-black">
                        {roleTitle}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">

                      <Link
                        href="/profile"
                        onClick={() => setOpen(false)}
                        className="rounded-xl bg-[#fff4cc] px-3 py-3 text-center text-xs font-black text-black"
                      >
                        Profile Settings
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-xl bg-red-50 px-3 py-3 text-center text-xs font-black text-[#fc1d15]"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}