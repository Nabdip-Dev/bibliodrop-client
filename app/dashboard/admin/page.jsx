"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        setError("");


        const [usersResponse, booksResponse, transactionsResponse] =
          await Promise.all([
            fetch(`${API_URL}/users`, { cache: "no-store" }),
            fetch(`${API_URL}/books?librarianId=admin`, {
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

        if (!transactionsResponse.ok) {
          throw new Error("Failed to load transactions");
        }

        const usersData = await usersResponse.json();
        const booksData = await booksResponse.json();
        const transactionsData = await transactionsResponse.json();

        setUsers(Array.isArray(usersData) ? usersData : []);

        setBooks(
          Array.isArray(booksData)
            ? booksData
            : Array.isArray(booksData.books)
              ? booksData.books
              : []
        );

        setTransactions(
          Array.isArray(transactionsData)
            ? transactionsData
            : []
        );
      } catch (err) {
        console.error("ADMIN DASHBOARD ERROR:", err);
        setError(err.message || "Failed to load admin dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();


  }, []);

  const pendingApprovals = books.filter(
    (book) => book.approvalStatus === "pending"
  ).length;

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: "👥",
    },
    {
      title: "Total Books",
      value: books.length,
      icon: "📚",
    },
    {
      title: "Pending Approvals",
      value: pendingApprovals,
      icon: "⏳",
    },
    {
      title: "Transactions",
      value: transactions.length,
      icon: "💳",
    },
  ];

  return (<main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8"> <div className="mx-auto max-w-6xl">


    {/* Header */}
    <div>
      <p className="text-sm font-bold uppercase tracking-wider text-[#fc1d15]">
        BiblioDrop
      </p>

      <h1 className="mt-2 text-3xl font-black text-black sm:text-4xl">
        Admin Dashboard
      </h1>

      <p className="mt-2 text-gray-600">
        Manage users, books, approvals and transactions.
      </p>
    </div>

    {/* Error */}
    {error && (
      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="font-semibold text-red-600">
          {error}
        </p>

        <p className="mt-1 text-sm text-red-500">
          Make sure the backend server is running on port 5000.
        </p>
      </div>
    )}

    {/* Stats */}
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">
                {stat.title}
              </p>

              <h2 className="mt-2 text-3xl font-black text-black">
                {loading ? "..." : stat.value}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Admin Actions */}
    <div className="mt-10">
      <h2 className="text-2xl font-black text-black">
        Administration
      </h2>

      <p className="mt-1 text-gray-500">
        Manage the BiblioDrop platform.
      </p>
    </div>

    <div className="mt-5 grid gap-5 md:grid-cols-2">

      {/* Approval */}
      <Link
        href="/dashboard/admin/approval"
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-black">
            Approval Queue
          </h3>

          <span className="text-2xl">✅</span>
        </div>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          Review books submitted by librarians and approve or reject
          them.
        </p>

        <div className="mt-5">
          <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700">
            {loading
              ? "Loading..."
              : `${pendingApprovals} Pending`}
          </span>
        </div>
      </Link>

      {/* Users */}
      <Link
        href="/dashboard/admin/users"
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-black">
            Manage Users
          </h3>

          <span className="text-2xl">👥</span>
        </div>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          View registered users and librarians.
        </p>

        <div className="mt-5">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
            {loading ? "Loading..." : `${users.length} Users`}
          </span>
        </div>
      </Link>

      {/* Books */}
      <Link
        href="/dashboard/admin/books"
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-black">
            All Books
          </h3>

          <span className="text-2xl">📚</span>
        </div>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          View all books available in the BiblioDrop system.
        </p>

        <div className="mt-5">
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
            {loading ? "Loading..." : `${books.length} Books`}
          </span>
        </div>
      </Link>

      {/* Transactions */}
      <Link
        href="/dashboard/admin/transactions"
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-black">
            Transactions
          </h3>

          <span className="text-2xl">💳</span>
        </div>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          View payment and transaction records.
        </p>

        <div className="mt-5">
          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-bold text-purple-700">
            {loading
              ? "Loading..."
              : `${transactions.length} Transactions`}
          </span>
        </div>
      </Link>

    </div>
  </div>
  </main>


  );
}
