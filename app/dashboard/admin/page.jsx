"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  FiHome,
  FiUsers,
  FiBookOpen,
  FiCheckCircle,
  FiCreditCard,
  FiClock,
  FiArrowRight,
  FiMenu,
} from "react-icons/fi";

const API_URL = "http://localhost:5000";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [pendingBooks, setPendingBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [totalBooks, setTotalBooks] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        setError("");

        const [
          usersResponse,
          booksResponse,
          pendingResponse,
          transactionsResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/users`, {
            cache: "no-store",
          }),

          fetch(`${API_URL}/books?page=1&limit=12`, {
            cache: "no-store",
          }),

          fetch(`${API_URL}/admin/books/pending`, {
            cache: "no-store",
          }),

          fetch(`${API_URL}/transactions`, {
            cache: "no-store",
          }),
        ]);

        if (!usersResponse.ok) {
          throw new Error("Failed to load users");
        }

        if (!booksResponse.ok) {
          throw new Error("Failed to load books");
        }

        if (!pendingResponse.ok) {
          throw new Error("Failed to load pending approvals");
        }

        if (!transactionsResponse.ok) {
          throw new Error("Failed to load transactions");
        }

        const usersData = await usersResponse.json();
        const booksData = await booksResponse.json();
        const pendingData = await pendingResponse.json();
        const transactionsData =
          await transactionsResponse.json();

        // USERS
        setUsers(
          Array.isArray(usersData)
            ? usersData
            : Array.isArray(usersData?.users)
            ? usersData.users
            : []
        );

        // BOOKS
        const loadedBooks = Array.isArray(booksData)
          ? booksData
          : Array.isArray(booksData?.books)
          ? booksData.books
          : [];

        setBooks(loadedBooks);

        setTotalBooks(
          typeof booksData?.total === "number"
            ? booksData.total
            : loadedBooks.length
        );

        // PENDING BOOKS
        setPendingBooks(
          Array.isArray(pendingData)
            ? pendingData
            : Array.isArray(pendingData?.books)
            ? pendingData.books
            : []
        );

        // TRANSACTIONS
        setTransactions(
          Array.isArray(transactionsData)
            ? transactionsData
            : Array.isArray(
                transactionsData?.transactions
              )
            ? transactionsData.transactions
            : []
        );
      } catch (err) {
        console.error("ADMIN DASHBOARD ERROR:", err);

        setError(
          err?.message ||
            "Failed to load admin dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  const pendingApprovals = pendingBooks.length;

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: FiUsers,
    },
    {
      title: "Total Books",
      value: totalBooks,
      icon: FiBookOpen,
    },
    {
      title: "Pending Approvals",
      value: pendingApprovals,
      icon: FiClock,
    },
    {
      title: "Transactions",
      value: transactions.length,
      icon: FiCreditCard,
    },
  ];

  const navigation = [
    {
      label: "Dashboard",
      href: "/dashboard/admin",
      icon: FiHome,
      active: true,
    },
    {
      label: "Approval Queue",
      href: "/dashboard/admin/approval",
      icon: FiCheckCircle,
      badge: pendingApprovals,
    },
    {
      label: "Users",
      href: "/dashboard/admin/users",
      icon: FiUsers,
      badge: users.length,
    },
    {
      label: "Books",
      href: "/dashboard/admin/books",
      icon: FiBookOpen,
      badge: totalBooks,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: FiCreditCard,
      badge: transactions.length,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100">

      {/* ==================================================
          DASHBOARD SHELL
      ================================================== */}

      <div className="mx-auto flex max-w-[1440px]">

        {/* ==================================================
            SIDEBAR
            Sticky only inside dashboard shell
        ================================================== */}

        <aside className="sticky top-0 hidden h-screen w-[220px] shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">

          {/* Logo */}

          <div className="flex h-[72px] items-center border-b border-gray-200 px-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#fc1d15]">
                BiblioDrop
              </p>

              <p className="mt-0.5 text-base font-extrabold text-black">
                Admin Panel
              </p>
            </div>
          </div>

          {/* Navigation */}

          <nav className="flex-1 px-3 py-5">

            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Menu
            </p>

            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      group flex h-10 items-center justify-between
                      rounded-lg px-2.5
                      text-[13px] font-semibold
                      transition-colors
                      ${
                        item.active
                          ? "bg-gray-100 text-black"
                          : "text-gray-500 hover:bg-gray-50 hover:text-black"
                      }
                    `}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon
                        size={17}
                        strokeWidth={2}
                        className={
                          item.active
                            ? "text-black"
                            : "text-gray-400 group-hover:text-black"
                        }
                      />

                      <span>{item.label}</span>
                    </span>

                    {item.badge !== undefined && (
                      <span className="min-w-[22px] rounded-md bg-gray-100 px-1.5 py-0.5 text-center text-[10px] font-bold text-gray-500">
                        {loading ? "—" : item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Admin Profile */}

          <div className="border-t border-gray-200 p-3">
            <div className="flex items-center gap-2.5 rounded-lg bg-gray-50 px-2.5 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                A
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-black">
                  Administrator
                </p>

                <p className="truncate text-[10px] text-gray-400">
                  BiblioDrop Admin
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* ==================================================
            MOBILE HEADER
        ================================================== */}

        <div className="w-full lg:hidden">
          <div className="border-b border-gray-200 bg-white px-4 py-3">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#fc1d15]">
                  BiblioDrop
                </p>

                <p className="text-base font-extrabold text-black">
                  Admin Panel
                </p>
              </div>

              <FiMenu
                size={20}
                className="text-gray-500"
              />
            </div>
          </div>

          <nav className="flex gap-1.5 overflow-x-auto border-b border-gray-200 bg-white px-4 py-2.5">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex shrink-0 items-center gap-1.5
                    rounded-lg px-2.5 py-2
                    text-xs font-semibold
                    ${
                      item.active
                        ? "bg-gray-100 text-black"
                        : "text-gray-500"
                    }
                  `}
                >
                  <Icon size={14} />

                  {item.label}

                  {item.badge !== undefined && (
                    <span className="rounded bg-white px-1 text-[9px]">
                      {loading ? "—" : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

        <section className="min-w-0 flex-1">

          <div className="px-4 py-5 sm:px-6 lg:px-7 lg:py-6">

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="flex flex-col justify-between gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-end">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#fc1d15]">
                  Overview
                </p>

                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
                  Admin Dashboard
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your BiblioDrop platform from one place.
                </p>
              </div>

            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-semibold text-red-600">
                  {error}
                </p>

                <p className="mt-0.5 text-xs text-red-500">
                  Make sure the backend server is running on port 5000.
                </p>
              </div>
            )}

            {/* ==================================================
                STATISTICS
            ================================================== */}

            <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">

              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="
                      rounded-xl
                      border border-gray-200
                      bg-white
                      px-4 py-4
                    "
                  >
                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-[11px] font-semibold text-gray-400">
                          {stat.title}
                        </p>

                        <p className="mt-1 text-2xl font-extrabold tracking-tight text-black">
                          {loading ? "—" : stat.value}
                        </p>
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                        <Icon size={17} />
                      </div>

                    </div>
                  </div>
                );
              })}

            </div>

            {/* ==================================================
                ADMINISTRATION
            ================================================== */}

            <div className="mt-8">
              <div>
                <h2 className="text-lg font-extrabold text-black">
                  Administration
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Manage users, books, approvals and transactions.
                </p>
              </div>

              {/* ==================================================
                  ACTION CARDS
              ================================================== */}

              <div className="mt-4 grid gap-3 md:grid-cols-2">

                {/* APPROVAL */}

                <AdminCard
                  href="/dashboard/admin/approval"
                  title="Approval Queue"
                  description="Review books submitted by librarians."
                  icon={FiCheckCircle}
                  badge={
                    loading
                      ? "Loading..."
                      : `${pendingApprovals} Pending`
                  }
                  badgeClass="bg-orange-100 text-orange-700"
                />

                {/* USERS */}

                <AdminCard
                  href="/dashboard/admin/users"
                  title="Manage Users"
                  description="View registered users and librarians."
                  icon={FiUsers}
                  badge={
                    loading
                      ? "Loading..."
                      : `${users.length} Users`
                  }
                  badgeClass="bg-blue-100 text-blue-700"
                />

                {/* BOOKS */}

                <AdminCard
                  href="/dashboard/admin/books"
                  title="All Books"
                  description="View all books in the BiblioDrop system."
                  icon={FiBookOpen}
                  badge={
                    loading
                      ? "Loading..."
                      : `${totalBooks} Books`
                  }
                  badgeClass="bg-green-100 text-green-700"
                />

                {/* TRANSACTIONS */}

                <AdminCard
                  href="/dashboard/admin/transactions"
                  title="Transactions"
                  description="View payment and transaction records."
                  icon={FiCreditCard}
                  badge={
                    loading
                      ? "Loading..."
                      : `${transactions.length} Transactions`
                  }
                  badgeClass="bg-purple-100 text-purple-700"
                />

              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}

/* ==================================================
   ADMIN CARD
================================================== */

function AdminCard({
  href,
  title,
  description,
  icon: Icon,
  badge,
  badgeClass,
}) {
  return (
    <Link
      href={href}
      className="
        group
        flex min-h-[118px]
        flex-col justify-between
        rounded-xl
        border border-gray-200
        bg-white
        p-4
        transition-all
        duration-200
        hover:border-gray-300
        hover:shadow-md
      "
    >
      <div className="flex items-start justify-between gap-4">

        <div className="flex items-start gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors group-hover:bg-gray-200">
            <Icon
              size={17}
              strokeWidth={2}
            />
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-black">
              {title}
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-gray-500">
              {description}
            </p>
          </div>

        </div>

        <FiArrowRight
          size={16}
          className="shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-black"
        />

      </div>

      <div className="mt-3">
        <span
          className={`rounded-md px-2 py-1 text-[10px] font-bold ${badgeClass}`}
        >
          {badge}
        </span>
      </div>
    </Link>
  );
}
