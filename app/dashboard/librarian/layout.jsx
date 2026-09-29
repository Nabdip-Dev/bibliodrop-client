"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  FiBookOpen,
  FiGrid,
  FiPlus,
  FiTruck,
  FiSettings,
  FiLogOut,
  FiUser,
  FiChevronRight,
  FiCommand,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

export default function LibrarianLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = user?.role?.toLowerCase();

  // ================= ROLE PROTECTION =================

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (role !== "librarian" && role !== "admin") {
      router.replace("/unauthorized");
    }
  }, [isPending, user, role, router]);

  // ================= LOADING =================

  if (isPending || !user) {
    return (
      <div className="flex min-h-[calc(100dvh-80px)] items-center justify-center bg-[#f8f8f6]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-500" />
      </div>
    );
  }

  // ================= UNAUTHORIZED =================

  if (role !== "librarian" && role !== "admin") {
    return null;
  }

  // ================= NAVIGATION =================

  const navigation = [
    {
      label: "Dashboard",
      href: "/dashboard/librarian",
      icon: FiGrid,
    },
    {
      label: "Books",
      href: "/dashboard/librarian/books",
      icon: FiBookOpen,
    },
    {
      label: "Add Book",
      href: "/dashboard/librarian/add-book",
      icon: FiPlus,
    },
    {
      label: "Deliveries",
      href: "/dashboard/librarian/deliveries",
      icon: FiTruck,
    },
    {
      label: "Profile Settings",
      href: "/profile",
      icon: FiSettings,
    },
  ];

  const isActive = (href) => {
    if (href === "/dashboard/librarian") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace("/");
  };

  return (
    <div className="min-h-[calc(100dvh-80px)] bg-[#f8f8f6]">
      <div className="mx-auto flex min-h-[calc(100dvh-80px)] w-full max-w-[1600px] flex-col overflow-hidden lg:flex-row">

        {/* =====================================================
            MOBILE / TABLET TOP NAV
        ===================================================== */}

        <div className="relative border-b border-gray-200 bg-white lg:hidden">
          <div className="flex items-center gap-3 overflow-x-auto px-3 py-2.5 scrollbar-none sm:px-4">

            {/* Profile */}
            <div className="flex shrink-0 items-center gap-2 pr-2">
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white shadow-[2px_2px_0_#facc15]">
                  <FiUser className="h-4 w-4" />
                </div>

                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              <div className="hidden xs:block sm:block">
                <p className="max-w-[100px] truncate text-[10px] font-bold text-black">
                  {user?.name || "Librarian"}
                </p>

                <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-gray-400">
                  Library Manager
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-7 w-px shrink-0 bg-gray-200" />

            {/* Navigation */}
            <nav className="flex min-w-max items-center gap-1.5">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 transition-all duration-200 sm:px-3 ${
                      active
                        ? "bg-black text-white shadow-[2px_2px_0_#facc15]"
                        : "bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-black"
                    }`}
                  >
                    <Icon
                      className={`h-3.5 w-3.5 ${
                        active ? "text-red-400" : "text-gray-400"
                      }`}
                    />

                    <span className="text-[8px] font-bold sm:text-[9px]">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Account */}
            <Link
              href="/profile"
              className="ml-auto flex shrink-0 items-center justify-center rounded-lg bg-gray-50 p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
              aria-label="Account settings"
            >
              <FiSettings className="h-3.5 w-3.5" />
            </Link>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex shrink-0 items-center justify-center rounded-lg bg-gray-50 p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
              aria-label="Logout"
            >
              <FiLogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* =====================================================
            DESKTOP SIDEBAR
        ===================================================== */}

        <aside className="relative hidden h-[calc(100dvh-80px)] w-[220px] shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-white lg:flex">

          {/* Decorative backgrounds */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-red-500/[0.04] blur-3xl" />

          <div className="pointer-events-none absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-yellow-400/[0.06] blur-3xl" />

          {/* ================= PROFILE ================= */}

          <div className="relative border-b border-gray-100 px-4 py-4">
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-[3px_3px_0_#facc15]">
                  <FiUser className="h-4 w-4" />
                </div>

                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-black">
                  {user?.name || "Librarian"}
                </p>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-red-500" />

                  <p className="truncate text-[7px] font-bold uppercase tracking-[0.15em] text-gray-400">
                    Library Manager
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/profile"
              className="group mt-3 flex items-center justify-between rounded-lg border border-gray-100 bg-[#fafaf8] px-2.5 py-2 transition-all duration-200 hover:border-red-100 hover:bg-red-500"
            >
              <div className="flex items-center gap-2">
                <FiSettings className="h-3 w-3 text-gray-400 transition group-hover:text-white" />

                <span className="text-[8px] font-semibold text-gray-500 transition group-hover:text-white">
                  Account Settings
                </span>
              </div>

              <FiChevronRight className="h-3 w-3 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-white" />
            </Link>
          </div>

          {/* ================= NAVIGATION ================= */}

          <nav className="relative flex-1 overflow-y-auto px-2.5 py-4">
            <div className="mb-2.5 flex items-center justify-between px-2">
              <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-gray-300">
                Workspace
              </p>

              <FiCommand className="h-2.5 w-2.5 text-gray-200" />
            </div>

            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center gap-2.5 overflow-hidden rounded-lg px-2.5 py-2 transition-all duration-200 ${
                      active
                        ? "bg-black text-white shadow-[3px_3px_0_#facc15]"
                        : "text-gray-500 hover:bg-red-50 hover:text-black"
                    }`}
                  >
                    {active && (
                      <span className="absolute -left-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-red-500/30 blur-lg" />
                    )}

                    <span
                      className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                        active
                          ? "bg-red-500 text-white"
                          : "bg-gray-50 text-gray-400 group-hover:bg-red-50 group-hover:text-red-500"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>

                    <span
                      className={`relative text-[9px] font-bold ${
                        active ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {item.label}
                    </span>

                    {active && (
                      <FiChevronRight className="relative ml-auto h-3 w-3 text-yellow-400" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* ================= BOTTOM ================= */}

          <div className="relative border-t border-gray-100 p-3">
            <div className="mb-2 flex items-center gap-1.5 px-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <span className="text-[7px] font-semibold text-gray-400">
                Library system active
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-50 transition group-hover:bg-red-100">
                <FiLogOut className="h-3 w-3" />
              </span>

              <span className="text-[8px] font-bold">
                Logout
              </span>
            </button>
          </div>
        </aside>

        {/* =====================================================
            RIGHT CONTENT
        ===================================================== */}

        <main className="min-w-0 flex-1 overflow-hidden bg-[#f8f8f6]">
          <div className="h-full min-h-0 overflow-y-auto overscroll-contain">

            <div className="relative min-h-full w-full overflow-x-hidden">

              {/* Decorative background */}
              <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-yellow-400/[0.035] blur-3xl" />

              <div className="relative w-full">
                {children}
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
