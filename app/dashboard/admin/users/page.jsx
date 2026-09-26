"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  FiArrowLeft,
  FiUsers,
  FiUser,
  FiMail,
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
  FiBookOpen,
} from "react-icons/fi";

const API_URL = "http://localhost:5000";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/users`, {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load users"
          );
        }

        const usersData = Array.isArray(data)
          ? data
          : Array.isArray(data.users)
          ? data.users
          : [];

        setUsers(usersData);
      } catch (err) {
        console.error("FETCH USERS ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load users"
        );

        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-7">

        {/* Header */}
        <div className="border-b border-gray-200 pb-5">
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 transition hover:bg-gray-50 hover:text-black"
          >
            <FiArrowLeft size={14} />
            Back to Dashboard
          </Link>

          <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#fc1d15]">
                BiblioDrop
              </p>

              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
                Manage Users
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View registered users and librarians.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-lg bg-gray-200 px-3 py-2 text-xs font-bold text-gray-600">
              <FiUsers size={14} />

              {loading
                ? "Loading..."
                : `${users.length} Users`}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <FiAlertCircle
              size={17}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <p className="flex-1 text-sm font-semibold text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-xs font-bold text-red-500 transition hover:text-red-700"
            >
              Close
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#fc1d15]" />

            <p className="mt-3 text-sm font-semibold text-gray-500">
              Loading users...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && users.length === 0 && !error && (
          <div className="mt-5 rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <FiUsers size={22} />
            </div>

            <h2 className="mt-4 text-base font-extrabold text-black">
              No Users Found
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              There are no users in the system yet.
            </p>
          </div>
        )}

        {/* Users Table */}
        {!loading && users.length > 0 && (
          <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white">

            {/* Table Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div>
                <h2 className="text-sm font-extrabold text-black">
                  Registered Users
                </h2>

                <p className="mt-0.5 text-[11px] text-gray-400">
                  Manage and view BiblioDrop accounts
                </p>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                <FiUsers size={15} />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">

                {/* Table Head */}
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-100">
                  {users.map((user, index) => {
                    const role = String(
                      user.role || "user"
                    ).toLowerCase();

                    const userName =
                      user.name ||
                      user.displayName ||
                      "Unknown User";

                    const userEmail =
                      user.email || "No email";

                    const userId =
                      user._id ||
                      user.id ||
                      `user-${index}`;

                    return (
                      <tr
                        key={userId}
                        className="transition-colors hover:bg-gray-50/70"
                      >

                        {/* User */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                              <FiUser size={15} />
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[190px] truncate text-xs font-bold text-gray-900">
                                {userName}
                              </p>

                              <p className="mt-0.5 text-[10px] text-gray-400">
                                BiblioDrop Account
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3">
                          <div className="flex max-w-[220px] items-center gap-2">
                            <FiMail
                              size={13}
                              className="shrink-0 text-gray-400"
                            />

                            <span className="truncate text-xs font-medium text-gray-600">
                              {userEmail}
                            </span>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3">
                          <RoleBadge role={role} />
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700">
                            <FiCheckCircle size={11} />
                            Active
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[10px] font-bold text-gray-400">
                            <FiShield size={12} />
                            Management Soon
                          </span>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

/* Table Head */
function TableHead({ children }) {
  return (
    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">
      {children}
    </th>
  );
}

/* Role Badge */
function RoleBadge({ role }) {
  if (role === "admin") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-100 px-2 py-1 text-[10px] font-bold text-purple-700">
        <FiShield size={11} />
        Admin
      </span>
    );
  }

  if (role === "librarian") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700">
        <FiBookOpen size={11} />
        Librarian
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-600">
      <FiUser size={11} />
      User
    </span>
  );
}
