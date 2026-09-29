"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_SERVER;

const roles = ["user", "librarian", "admin"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [roleChanges, setRoleChanges] = useState({});

  // =========================================================
  // LOAD USERS
  // =========================================================
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/users`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load users.");
        }

        const data = await response.json();

        const userList = Array.isArray(data) ? data : [];

        setUsers(userList);

        const initialRoles = {};

        userList.forEach((user) => {
          initialRoles[user._id] = user.role || "user";
        });

        setRoleChanges(initialRoles);
      } catch (error) {
        console.error("LOAD USERS ERROR:", error);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // =========================================================
  // CHANGE ROLE
  // =========================================================
  const handleRoleChange = (userId, role) => {
    setRoleChanges((previous) => ({
      ...previous,
      [userId]: role,
    }));

    setSuccess("");
    setError("");
  };

  // =========================================================
  // UPDATE ROLE
  // =========================================================
  const handleSaveRole = async (user) => {
    const userId = user._id;
    const newRole = roleChanges[userId];

    if (!newRole) {
      setError("Please select a valid role.");
      return;
    }

    if (newRole === user.role) {
      setSuccess("No role changes to save.");
      setError("");
      return;
    }

    try {
      setSavingId(userId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/users/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: newRole,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to update user role."
        );
      }

      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item._id === userId
            ? {
                ...item,
                role: newRole,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );

      setRoleChanges((previous) => ({
        ...previous,
        [userId]: newRole,
      }));

      setSuccess(
        `${user.name || user.email}'s role updated to ${newRole}.`
      );
    } catch (error) {
      console.error("UPDATE ROLE ERROR:", error);

      setError(
        error.message || "Failed to update user role."
      );
    } finally {
      setSavingId(null);
    }
  };

  // =========================================================
  // ROLE BADGE
  // =========================================================
  const getRoleBadge = (role) => {
    if (role === "admin") {
      return "bg-rose-50 text-rose-600 border-rose-100";
    }

    if (role === "librarian") {
      return "bg-violet-50 text-violet-600 border-violet-100";
    }

    return "bg-sky-50 text-sky-600 border-sky-100";
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-3 border-slate-200 border-t-sky-500" />

            <p className="text-sm text-slate-500">
              Loading users...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 md:py-8">
      <div className="mx-auto max-w-6xl">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-500" />

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Administration
            </p>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Manage Users
          </h1>

          <p className="mt-1.5 max-w-xl text-sm text-slate-500">
            View registered users and manage their account roles.
          </p>
        </div>

        {/* =====================================================
            ALERTS
        ===================================================== */}
        {error && (
          <div className="mb-5 rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
            {success}
          </div>
        )}

        {/* =====================================================
            STAT CARDS
        ===================================================== */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

          {/* Total */}
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Total Users
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-700">
                  {users.length}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-500">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-8a4 4 0 11-8 0 4 4 0 018 0zm6 2a3 3 0 10-6 0"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Librarians */}
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Librarians
                </p>

                <p className="mt-1 text-2xl font-bold text-violet-500">
                  {
                    users.filter(
                      (user) => user.role === "librarian"
                    ).length
                  }
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-500">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.5V19m0-12.5C10.5 5.5 8.5 4 5 4v12c3.5 0 5.5 1.5 7 2.5m0-12C13.5 5.5 15.5 4 19 4v12c-3.5 0-5.5 1.5-7 2.5"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Admins */}
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  Administrators
                </p>

                <p className="mt-1 text-2xl font-bold text-rose-500">
                  {
                    users.filter(
                      (user) => user.role === "admin"
                    ).length
                  }
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15l3-3m0 0l-3-3m3 3H4m13-8h3a1 1 0 011 1v14a1 1 0 01-1 1h-3"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            USERS TABLE
        ===================================================== */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* TABLE HEADER */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-700">
                All Users
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Manage account permissions
              </p>
            </div>

            <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
              {users.length} users
            </span>
          </div>

          {/* ===================================================
              DESKTOP
          =================================================== */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    User
                  </th>

                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Email
                  </th>

                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Current Role
                  </th>

                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Change Role
                  </th>

                  <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-10 text-center text-sm text-slate-400"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const currentRole = user.role || "user";

                    const selectedRole =
                      roleChanges[user._id] || currentRole;

                    const isSaving = savingId === user._id;

                    const hasChanged =
                      selectedRole !== currentRole;

                    return (
                      <tr
                        key={user._id}
                        className="transition-colors hover:bg-slate-50/60"
                      >
                        {/* USER */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name || "User"}
                                className="h-9 w-9 rounded-full border border-slate-200 object-cover"
                              />
                            ) : (
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-50 text-xs font-bold text-sky-600">
                                {(
                                  user.name ||
                                  user.email ||
                                  "U"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-700">
                                {user.name || "Unnamed User"}
                              </p>

                              <p className="mt-0.5 max-w-[150px] truncate text-[10px] text-slate-400">
                                ID: {user._id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* EMAIL */}
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-500">
                            {user.email}
                          </p>
                        </td>

                        {/* CURRENT ROLE */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${getRoleBadge(
                              currentRole
                            )}`}
                          >
                            {currentRole}
                          </span>
                        </td>

                        {/* CHANGE ROLE */}
                        <td className="px-5 py-4">
                          <select
                            value={selectedRole}
                            onChange={(e) =>
                              handleRoleChange(
                                user._id,
                                e.target.value
                              )
                            }
                            disabled={isSaving}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {roles.map((role) => (
                              <option
                                key={role}
                                value={role}
                              >
                                {role.charAt(0).toUpperCase() +
                                  role.slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* ACTION */}
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              handleSaveRole(user)
                            }
                            disabled={
                              isSaving || !hasChanged
                            }
                            className="rounded-lg bg-sky-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ===================================================
              MOBILE
          =================================================== */}
          <div className="divide-y divide-slate-100 md:hidden">
            {users.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-slate-400">
                No users found.
              </div>
            ) : (
              users.map((user) => {
                const currentRole = user.role || "user";

                const selectedRole =
                  roleChanges[user._id] || currentRole;

                const isSaving = savingId === user._id;

                const hasChanged =
                  selectedRole !== currentRole;

                return (
                  <div key={user._id} className="p-4">

                    {/* USER */}
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-xs font-bold text-sky-600">
                          {(
                            user.name ||
                            user.email ||
                            "U"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-700">
                          {user.name || "Unnamed User"}
                        </p>

                        <p className="truncate text-xs text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* ROLE INFO */}
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Current Role
                        </p>

                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${getRoleBadge(
                            currentRole
                          )}`}
                        >
                          {currentRole}
                        </span>
                      </div>
                    </div>

                    {/* SELECT */}
                    <div className="mt-4">
                      <label
                        htmlFor={`role-${user._id}`}
                        className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                      >
                        Change Role
                      </label>

                      <select
                        id={`role-${user._id}`}
                        value={selectedRole}
                        onChange={(e) =>
                          handleRoleChange(
                            user._id,
                            e.target.value
                          )
                        }
                        disabled={isSaving}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {roles.map((role) => (
                          <option
                            key={role}
                            value={role}
                          >
                            {role.charAt(0).toUpperCase() +
                              role.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* SAVE */}
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveRole(user)
                      }
                      disabled={
                        isSaving || !hasChanged
                      }
                      className="mt-3 w-full rounded-lg bg-sky-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      {isSaving
                        ? "Saving..."
                        : "Save Role"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
