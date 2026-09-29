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

        setUsers(
          Array.isArray(usersData)
            ? usersData
            : Array.isArray(usersData?.users)
            ? usersData.users
            : []
        );

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

        setPendingBooks(
          Array.isArray(pendingData)
            ? pendingData
            : Array.isArray(pendingData?.books)
            ? pendingData.books
            : []
        );

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
          DESKTOP SIDEBAR
      ================================================== */}

      <aside
        className="
          fixed
          inset-y-0
          left-0
          z-40
          hidden
          w-64
          border-r
          border-gray-200
          bg-white
          lg:flex
          lg:flex-col
          xl:w-72
        "
      >
        {/* Logo */}

        <div className="flex h-20 shrink-0 items-center border-b border-gray-200 px-5 xl:px-6">
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

        <nav className="flex-1 overflow-y-auto px-3 py-5 xl:px-4">

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
                    group
                    flex
                    min-h-11
                    items-center
                    justify-between
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    font-semibold
                    transition-colors
                    ${
                      item.active
                        ? "bg-gray-100 text-black"
                        : "text-gray-500 hover:bg-gray-50 hover:text-black"
                    }
                  `}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Icon
                      size={18}
                      strokeWidth={2}
                      className={
                        item.active
                          ? "shrink-0 text-black"
                          : "shrink-0 text-gray-400 group-hover:text-black"
                      }
                    />

                    <span className="truncate">
                      {item.label}
                    </span>
                  </span>

                  {item.badge !== undefined && (
                    <span className="ml-2 min-w-[24px] shrink-0 rounded-md bg-gray-100 px-1.5 py-1 text-center text-[10px] font-bold text-gray-500">
                      {loading ? "—" : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Admin Profile */}

        <div className="shrink-0 border-t border-gray-200 p-3 xl:p-4">
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
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
          MAIN AREA
      ================================================== */}

      <div
        className="
          min-h-screen
          lg:pl-64
          xl:pl-72
        "
      >

        {/* ==================================================
            MOBILE / TABLET HEADER
        ================================================== */}

        <header className="border-b border-gray-200 bg-white lg:hidden">

          <div className="flex min-h-[68px] items-center justify-between gap-4 px-4 sm:px-6">

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#fc1d15]">
                BiblioDrop
              </p>

              <p className="truncate text-base font-extrabold text-black sm:text-lg">
                Admin Panel
              </p>
            </div>

            <button
              type="button"
              aria-label="Open menu"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-gray-200
                bg-white
                text-gray-600
              "
            >
              <FiMenu size={19} />
            </button>
          </div>

          {/* Mobile Navigation */}

          <nav
            className="
              flex
              gap-1.5
              overflow-x-auto
              border-t
              border-gray-100
              px-4
              py-2.5
              scrollbar-none
              sm:px-6
            "
          >
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex
                    min-h-9
                    shrink-0
                    items-center
                    gap-1.5
                    rounded-lg
                    px-2.5
                    py-2
                    text-xs
                    font-semibold
                    ${
                      item.active
                        ? "bg-gray-100 text-black"
                        : "text-gray-500 hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon size={14} />

                  <span>{item.label}</span>

                  {item.badge !== undefined && (
                    <span
                      className={`
                        rounded
                        px-1.5
                        py-0.5
                        text-[9px]
                        ${
                          item.active
                            ? "bg-white text-gray-600"
                            : "bg-gray-100 text-gray-500"
                        }
                      `}
                    >
                      {loading ? "—" : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </header>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <section className="w-full">

          <div
            className="
              mx-auto
              w-full
              max-w-[1600px]
              px-4
              py-5
              sm:px-6
              sm:py-6
              md:px-8
              lg:px-8
              lg:py-7
              xl:px-10
              2xl:px-12
            "
          >

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div
              className="
                flex
                flex-col
                gap-3
                border-b
                border-gray-200
                pb-5
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-[#fc1d15]">
                  Overview
                </p>

                <h1
                  className="
                    mt-1
                    text-2xl
                    font-extrabold
                    tracking-tight
                    text-black
                    sm:text-3xl
                    lg:text-[32px]
                  "
                >
                  Admin Dashboard
                </h1>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                  Manage your BiblioDrop platform from one place.
                </p>
              </div>
            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 sm:px-5">
                <p className="text-sm font-semibold text-red-600">
                  {error}
                </p>

                <p className="mt-1 text-xs leading-5 text-red-500">
                  Make sure the backend server is running on port 5000.
                </p>
              </div>
            )}

            {/* ==================================================
                STATISTICS
            ================================================== */}

            <div
              className="
                mt-5
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
                lg:grid-cols-4
                lg:gap-4
              "
            >
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      px-4
                      py-4
                      sm:px-5
                      sm:py-5
                    "
                  >
                    <div className="flex items-center justify-between gap-3">

                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-semibold text-gray-400">
                          {stat.title}
                        </p>

                        <p className="mt-1 text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
                          {loading ? "—" : stat.value}
                        </p>
                      </div>

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                        <Icon size={18} />
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* ==================================================
                ADMINISTRATION
            ================================================== */}

            <div className="mt-8 sm:mt-10">

              <div>
                <h2 className="text-lg font-extrabold text-black sm:text-xl">
                  Administration
                </h2>

                <p className="mt-0.5 text-xs leading-5 text-gray-500 sm:text-sm">
                  Manage users, books, approvals and transactions.
                </p>
              </div>

              {/* ==================================================
                  ACTION CARDS
              ================================================== */}

              <div
                className="
                  mt-4
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-2
                  xl:grid-cols-4
                  xl:gap-4
                "
              >

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
        flex
        min-h-[130px]
        flex-col
        justify-between
        rounded-xl
        border
        border-gray-200
        bg-white
        p-4
        transition-all
        duration-200
        hover:border-gray-300
        hover:shadow-md
        sm:min-h-[140px]
        sm:p-5
      "
    >
      <div className="flex items-start justify-between gap-3">

        <div className="flex min-w-0 items-start gap-3">

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-gray-100
              text-gray-600
              transition-colors
              group-hover:bg-gray-200
            "
          >
            <Icon
              size={18}
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-extrabold text-black sm:text-[15px]">
              {title}
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-gray-500 sm:text-[13px]">
              {description}
            </p>
          </div>

        </div>

        <FiArrowRight
          size={16}
          className="
            mt-0.5
            shrink-0
            text-gray-300
            transition-all
            group-hover:translate-x-0.5
            group-hover:text-black
          "
        />
      </div>

      <div className="mt-4">
        <span
          className={`
            inline-flex
            max-w-full
            rounded-md
            px-2
            py-1
            text-[10px]
            font-bold
            ${badgeClass}
          `}
        >
          {badge}
        </span>
      </div>
    </Link>
  );
}
