"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export default function LibrarianLayout({ children }) {
  const pathname = usePathname();

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
      href: "/dashboard/librarian/profile",
      icon: FiSettings,
    },
  ];

  const isActive = (href) => {
    if (href === "/dashboard/librarian") {
      return pathname === href;
    }

    return pathname.startsWith(href);


  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden bg-[#f8f8f6]">
      <div className="mx-auto flex h-full max-w-[1600px] overflow-hidden">

        {/* ================= SIDEBAR ================= */}
        <aside className="relative flex h-full w-[220px] shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-white">

          {/* Decorative glow */}
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
                  Librarian
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
              href="/dashboard/librarian/profile"
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
          <nav className="relative flex-1 overflow-hidden px-2.5 py-4">

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
                    className={`group relative flex items-center gap-2.5 overflow-hidden rounded-lg px-2.5 py-2 transition-all duration-200 ${active
                        ? "bg-black text-white shadow-[3px_3px_0_#facc15]"
                        : "text-gray-500 hover:bg-red-50 hover:text-black"
                      }`}
                  >
                    {active && (
                      <span className="absolute -left-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-red-500/30 blur-lg" />
                    )}

                    <span
                      className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${active
                          ? "bg-red-500 text-white"
                          : "bg-gray-50 text-gray-400 group-hover:bg-red-50 group-hover:text-red-500"
                        }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>

                    <span
                      className={`relative text-[9px] font-bold ${active ? "text-white" : "text-gray-500"
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

        {/* ================= RIGHT CONTENT ================= */}
        <main className="h-full min-w-0 flex-1 overflow-hidden bg-[#f8f8f6]">
          <div className="h-full overflow-y-auto overscroll-contain">

            <div className="relative min-h-full">

              {/* Background decoration */}
              <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-yellow-400/[0.035] blur-3xl" />

              <div className="relative">
                {children}
              </div>

            </div>
          </div>
        </main>

      </div>
    </div>


  );
}