"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  /* ================= USER DATA ================= */

  const firstName =
    user?.name?.trim().split(/\s+/)[0] ||
    user?.email?.split("@")[0] ||
    "User";

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 3)
      .toUpperCase() || firstName.slice(0, 3).toUpperCase();

  const role = user?.role?.toLowerCase();

  const roleName = role === "librarian" ? "Librarian" : "Member";

  /* ================= NAVIGATION ================= */

  const navItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Browse",
      href: "/browse-books",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
  ];

  /* ================= OUTSIDE CLICK ================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================= ESCAPE ================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* ================= BODY LOCK ================= */

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ================= HELPERS ================= */

  const closeAll = () => {
    setOpen(false);
    setProfileOpen(false);
  };

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    try {
      await authClient.signOut();

      closeAll();

      router.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-[100] w-full">
      <nav className="relative bg-[#fcc615]">

        {/* =====================================================
            MAIN NAVBAR
        ====================================================== */}

        <div className="mx-auto flex h-[78px] max-w-[1500px] items-center px-5 sm:px-8 lg:px-12">

          {/* ================= BRAND ================= */}

          <Link
            href="/"
            onClick={closeAll}
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] bg-black transition-transform duration-500 group-hover:rotate-[-6deg]">
              <div className="absolute -right-3 -top-3 h-7 w-7 rounded-full bg-[#fc1d15]" />

              <svg
                viewBox="0 0 48 48"
                className="relative z-10 h-6 w-6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 9C11 7.343 12.343 6 14 6h21v30H14c-1.657 0-3 1.343-3 3V9Z"
                  fill="white"
                />

                <path
                  d="M35 6H14c-1.657 0-3 1.343-3 3v30c0-1.657 1.343-3 3-3h21V6Z"
                  stroke="white"
                  strokeWidth="2"
                />

                <path
                  d="M17 14h12M17 20h12M17 26h7"
                  stroke="#111"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="leading-none">
              <div className="text-[23px] font-black tracking-[-0.055em] text-black">
                Biblio<span className="text-[#fc1d15]">Drop</span>
              </div>

              <div className="mt-[5px] hidden text-[8px] font-bold uppercase tracking-[0.28em] text-black/45 sm:block">
                Local Library
              </div>
            </div>
          </Link>

          {/* ================= CENTER NAV ================= */}

          <div className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
            <div className="flex items-center gap-9">

              {navItems.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeAll}
                    className="group relative py-2 text-[13px] font-bold tracking-[-0.01em] text-black/60 transition-colors duration-300 hover:text-black"
                  >
                    {item.label}

                    <span
                      className={`absolute -bottom-1 left-1/2 h-[3px] -translate-x-1/2 rounded-full bg-[#fc1d15] transition-all duration-300 ${
                        active
                          ? "w-5 opacity-100"
                          : "w-0 opacity-0 group-hover:w-5 group-hover:opacity-100"
                      }`}
                    />
                  </Link>
                );
              })}

            </div>
          </div>

          {/* ================= RIGHT ================= */}

          <div className="ml-auto hidden items-center lg:flex">

            {/* ================= GUEST ================= */}

            {!isPending && !user && (
              <div className="flex items-center gap-6">

                <Link
                  href="/login"
                  className="text-[13px] font-bold text-black/65 transition-colors hover:text-black"
                >
                  Sign in
                </Link>

                <Link
                  href="/register"
                  className="group flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-[12px] font-extrabold text-white transition-all duration-300 hover:bg-[#fc1d15]"
                >
                  <span>Join BiblioDrop</span>

                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                  >
                    <path
                      d="M4 10h11M11 6l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>

              </div>
            )}

            {/* ================= USER ================= */}

            {!isPending && user && (
              <div ref={profileRef} className="relative rounded-4xl border-2 p-1 border-red-600 ">

                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="group flex items-center gap-3"
                  aria-expanded={profileOpen}
                >

                  {/* Avatar */}

                  <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-black transition-transform duration-300 group-hover:scale-105">

                    {user.image ? (
                      <img
                        src={user.image}
                        alt={firstName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-black tracking-wide text-[#fcc615]">
                        {initials}
                      </span>
                    )}

                    <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-[#fc1d15] ring-2 ring-[#fcc615]" />

                  </div>

                  {/* Name */}

                  <div className="hidden text-left xl:block">
                    <div className="max-w-[120px] truncate text-[12px] font-extrabold leading-none text-black">
                      {firstName}
                    </div>

                    <div className="mt-1 text-[8px] font-bold uppercase tracking-[0.18em] text-black/40">
                      {roleName}
                    </div>
                  </div>

                  {/* Chevron */}

                  <svg
                    viewBox="0 0 20 20"
                    className={`h-4 w-4 text-black/45 transition-transform duration-300 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                  >
                    <path
                      d="m5 7 5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                </button>

                {/* ================= PROFILE DROPDOWN ================= */}

                {profileOpen && (
                  <div className="absolute right-0 top-[calc(100%+18px)] w-[310px] overflow-hidden rounded-[22px] bg-[#fffdf7] shadow-[0_24px_70px_rgba(0,0,0,0.18)]">

                    {/* Accent */}

                    <div className="relative h-[7px] bg-[#fc1d15]">
                      <div className="absolute right-8 top-0 h-7 w-7 rounded-b-full bg-[#fcc615]" />
                    </div>

                    {/* User information */}

                    <div className="px-5 pb-5 pt-6">

                      <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black">

                          {user.image ? (
                            <img
                              src={user.image}
                              alt={firstName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-black text-[#fcc615]">
                              {initials}
                            </span>
                          )}

                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-[15px] font-black tracking-[-0.02em] text-black">
                            {user.name || firstName}
                          </p>

                          <p className="mt-1 truncate text-[11px] text-black/40">
                            {user.email}
                          </p>

                        </div>

                      </div>

                      <div className="mt-5 flex items-center justify-between rounded-xl bg-[#fcc615]/25 px-3.5 py-3">

                        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/45">
                          Account
                        </span>

                        <span className="text-[10px] font-black uppercase tracking-wider text-black">
                          {roleName}
                        </span>

                      </div>

                    </div>

                    {/* Menu */}

                    <div className="px-3 pb-3">

                      {/* Profile */}

                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[#fcc615]/20"
                      >

                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fcc615] text-black">

                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                          >
                            <circle
                              cx="12"
                              cy="8"
                              r="3.2"
                              stroke="currentColor"
                              strokeWidth="1.7"
                            />

                            <path
                              d="M5.5 20c.7-3.8 2.8-5.8 6.5-5.8s5.8 2 6.5 5.8"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                            />
                          </svg>

                        </span>

                        <div>
                          <p className="text-[12px] font-extrabold text-black">
                            Profile
                          </p>

                          <p className="mt-0.5 text-[9px] text-black/35">
                            Manage your account
                          </p>
                        </div>

                      </Link>

                      {/* Dashboard */}

                      <Link
                        href="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[#fcc615]/20"
                      >

                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fc1d15] text-white">

                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                          >
                            <rect
                              x="4"
                              y="4"
                              width="6"
                              height="6"
                              rx="1"
                              stroke="currentColor"
                              strokeWidth="1.7"
                            />

                            <rect
                              x="14"
                              y="4"
                              width="6"
                              height="6"
                              rx="1"
                              stroke="currentColor"
                              strokeWidth="1.7"
                            />

                            <rect
                              x="4"
                              y="14"
                              width="6"
                              height="6"
                              rx="1"
                              stroke="currentColor"
                              strokeWidth="1.7"
                            />

                            <rect
                              x="14"
                              y="14"
                              width="6"
                              height="6"
                              rx="1"
                              stroke="currentColor"
                              strokeWidth="1.7"
                            />
                          </svg>

                        </span>

                        <div>
                          <p className="text-[12px] font-extrabold text-black">
                            Dashboard
                          </p>

                          <p className="mt-0.5 text-[9px] text-black/35">
                            Your library overview
                          </p>
                        </div>

                      </Link>

                      {/* Separator */}

                      <div className="my-2 h-px bg-black/[0.06]" />

                      {/* Logout */}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-red-50"
                      >

                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fc1d15]/10 text-[#fc1d15]">

                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                          >
                            <path
                              d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                            />

                            <path
                              d="M14 8l4 4-4 4M9 12h9"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>

                        </span>

                        <div>

                          <p className="text-[12px] font-extrabold text-[#fc1d15]">
                            Sign out
                          </p>

                          <p className="mt-0.5 text-[9px] text-black/35">
                            End your current session
                          </p>

                        </div>

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
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-black text-[#fcc615] lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >

            {open ? (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
              >
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}

          </button>

        </div>

        {/* =====================================================
            MOBILE MENU
        ====================================================== */}

        <div
          className={`overflow-hidden transition-all duration-500 ease-out lg:hidden ${
            open
              ? "max-h-[700px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >

          <div className="px-5 pb-6 pt-2 sm:px-8">

            {/* Navigation */}

            <div className="rounded-[22px] bg-white/75 p-2">

              {navItems.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeAll}
                    className={`flex items-center justify-between rounded-xl px-4 py-4 transition-all ${
                      active
                        ? "bg-black text-white"
                        : "text-black hover:bg-white"
                    }`}
                  >

                    <span className="text-sm font-extrabold">
                      {item.label}
                    </span>

                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4 opacity-40"
                      fill="none"
                    >
                      <path
                        d="M4 10h11M11 6l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                  </Link>
                );
              })}

            </div>

            {/* ================= MOBILE GUEST ================= */}

            {!isPending && !user && (
              <div className="mt-3 grid grid-cols-2 gap-3">

                <Link
                  href="/login"
                  onClick={closeAll}
                  className="flex items-center justify-center rounded-full bg-white py-3.5 text-sm font-extrabold text-black"
                >
                  Sign in
                </Link>

                <Link
                  href="/register"
                  onClick={closeAll}
                  className="flex items-center justify-center rounded-full bg-[#fc1d15] py-3.5 text-sm font-extrabold text-white"
                >
                  Join BiblioDrop
                </Link>

              </div>
            )}

            {/* ================= MOBILE USER ================= */}

            {!isPending && user && (
              <div className="mt-3 rounded-[22px] bg-white p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black">

                    {user.image ? (
                      <img
                        src={user.image}
                        alt={firstName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[11px] font-black text-[#fcc615]">
                        {initials}
                      </span>
                    )}

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-black text-black">
                      {user.name || firstName}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-black/40">
                      {user.email}
                    </p>

                  </div>

                  <span className="rounded-full bg-[#fcc615] px-3 py-1 text-[9px] font-black uppercase tracking-wider text-black">
                    {roleName}
                  </span>

                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">

                  <Link
                    href="/profile"
                    onClick={closeAll}
                    className="rounded-xl bg-[#fcc615]/25 py-3 text-center text-xs font-black text-black"
                  >
                    Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl bg-red-50 py-3 text-center text-xs font-black text-[#fc1d15]"
                  >
                    Sign out
                  </button>

                </div>

              </div>
            )}

          </div>

        </div>

      </nav>
    </header>
  );
}
