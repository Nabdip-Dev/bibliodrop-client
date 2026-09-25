"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

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
    } catch (error) {
      console.error("FETCH USERS ERROR:", error);

      setError(
        error.message || "Failed to load users"
      );

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-[#fc1d15]">
            BiblioDrop
          </p>

          <h1 className="mt-2 text-3xl font-black text-black">
            Manage Users
          </h1>

          <p className="mt-2 text-gray-600">
            View and manage BiblioDrop users.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}

        {loading && (
          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#fc1d15]" />

            <p className="mt-4 font-semibold text-gray-600">
              Loading users...
            </p>
          </div>
        )}

        {!loading && users.length === 0 && !error && (
          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow">
            <div className="text-4xl">👥</div>

            <h2 className="mt-4 text-xl font-bold text-black">
              No Users Found
            </h2>

            <p className="mt-2 text-gray-500">
              There are no users in the system yet.
            </p>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow">
            <table className="w-full min-w-[650px]">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    Name
                  </th>

                  <th className="px-6 py-4 text-left">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left">
                    Role
                  </th>

                  <th className="px-6 py-4 text-left">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const role = String(
                    user.role || "user"
                  ).toLowerCase();

                  return (
                    <tr
                      key={user._id || user.id}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-6 py-4 font-medium text-black">
                        {user.name ||
                          user.displayName ||
                          "Unknown User"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {user.email || "No email"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : role === "librarian"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {role
                            .charAt(0)
                            .toUpperCase() +
                            role.slice(1)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-400">
                          Management action
                          coming soon
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}