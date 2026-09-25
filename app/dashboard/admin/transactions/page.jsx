"use client";

import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [transactionsResponse, usersResponse] =
        await Promise.all([
          fetch(`${API_URL}/transactions`, {
            method: "GET",
            cache: "no-store",
          }),

          fetch(`${API_URL}/users`, {
            method: "GET",
            cache: "no-store",
          }),
        ]);

      const transactionsData =
        await transactionsResponse.json();

      const usersData = await usersResponse.json();

      if (!transactionsResponse.ok) {
        throw new Error(
          transactionsData.message ||
            "Failed to load transactions"
        );
      }

      if (!usersResponse.ok) {
        throw new Error(
          usersData.message ||
            "Failed to load users"
        );
      }

      const transactionList = Array.isArray(
        transactionsData
      )
        ? transactionsData
        : Array.isArray(transactionsData?.transactions)
        ? transactionsData.transactions
        : [];

      const userList = Array.isArray(usersData)
        ? usersData
        : Array.isArray(usersData?.users)
        ? usersData.users
        : [];

      setTransactions(transactionList);
      setUsers(userList);
    } catch (error) {
      console.error(
        "FETCH TRANSACTIONS ERROR:",
        error
      );

      setError(
        error.message ||
          "Failed to load transactions"
      );

      setTransactions([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const findUserById = (id) => {
    if (!id) {
      return null;
    }

    const stringId = String(id);

    return (
      users.find(
        (user) =>
          String(user.id || "") === stringId
      ) ||
      users.find(
        (user) =>
          String(user._id || "") === stringId
      ) ||
      users.find(
        (user) =>
          String(user.userId || "") === stringId
      ) ||
      null
    );
  };

  const getUserEmail = (transaction) => {
    if (transaction.userEmail) {
      return transaction.userEmail;
    }

    if (transaction.email) {
      return transaction.email;
    }

    if (transaction.user?.email) {
      return transaction.user.email;
    }

    const user = findUserById(
      transaction.userId
    );

    if (user?.email) {
      return user.email;
    }

    return "N/A";
  };

  const getLibrarianEmail = (transaction) => {
    if (transaction.librarianEmail) {
      return transaction.librarianEmail;
    }

    if (transaction.librarian?.email) {
      return transaction.librarian.email;
    }

    const librarian = findUserById(
      transaction.librarianId
    );

    if (librarian?.email) {
      return librarian.email;
    }

    return "N/A";
  };

  const getTransactionId = (transaction) => {
    return (
      transaction.transactionId ||
      transaction.paymentId ||
      transaction.sessionId ||
      transaction._id ||
      "N/A"
    );
  };

  const formatAmount = (amount) => {
    const numericAmount = Number(amount || 0);

    return `₹${numericAmount.toFixed(2)}`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatus = (transaction) => {
    return String(
      transaction.status ||
        transaction.paymentStatus ||
        "unknown"
    ).toLowerCase();
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-[#fc1d15]">
            BIBLIODROP
          </p>

          <h1 className="mt-2 text-3xl font-black text-black">
            Transactions
          </h1>

          <p className="mt-2 text-gray-600">
            View payment and transaction records.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#fc1d15]" />

            <p className="mt-4 font-semibold text-gray-600">
              Loading transactions...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          transactions.length === 0 &&
          !error && (
            <div className="mt-8 rounded-xl bg-white p-10 text-center shadow">
              <div className="text-4xl">💳</div>

              <h2 className="mt-4 text-xl font-bold text-black">
                No Transactions Found
              </h2>

              <p className="mt-2 text-gray-500">
                There are no payment records yet.
              </p>
            </div>
          )}

        {/* Table */}
        {!loading && transactions.length > 0 && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Transaction ID
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      User Email
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Librarian Email
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map(
                    (transaction, index) => {
                      const status =
                        getStatus(transaction);

                      const isPaid =
                        status === "paid" ||
                        status === "completed" ||
                        status === "success" ||
                        status === "succeeded";

                      const transactionId =
                        getTransactionId(
                          transaction
                        );

                      return (
                        <tr
                          key={
                            transaction._id ||
                            transaction.transactionId ||
                            transaction.paymentId ||
                            index
                          }
                          className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                        >
                          {/* Transaction ID */}
                          <td className="px-6 py-5">
                            <span className="font-mono text-sm font-medium text-gray-700">
                              {transactionId}
                            </span>
                          </td>

                          {/* User Email */}
                          <td className="px-6 py-5">
                            <span className="text-sm font-medium text-gray-800">
                              {getUserEmail(
                                transaction
                              )}
                            </span>
                          </td>

                          {/* Librarian Email */}
                          <td className="px-6 py-5">
                            <span className="text-sm font-medium text-gray-800">
                              {getLibrarianEmail(
                                transaction
                              )}
                            </span>
                          </td>

                          {/* Amount */}
                          <td className="px-6 py-5">
                            <span className="font-bold text-gray-900">
                              {formatAmount(
                                transaction.amount ||
                                  transaction.totalAmount ||
                                  transaction.deliveryFee
                              )}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-5">
                            <span className="text-sm text-gray-600">
                              {formatDate(
                                transaction.createdAt ||
                                  transaction.date
                              )}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                                isPaid
                                  ? "bg-green-100 text-green-700"
                                  : status ===
                                    "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {status
                                .replace(
                                  /_/g,
                                  " "
                                )
                                .replace(
                                  /\b\w/g,
                                  (letter) =>
                                    letter.toUpperCase()
                                )}
                            </span>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}