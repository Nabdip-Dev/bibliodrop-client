"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  FiArrowLeft,
  FiCreditCard,
  FiMail,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiAlertCircle,
  FiHash,
  FiUser,
} from "react-icons/fi";

const API_URL = "http://localhost:5000";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          transactionsResponse,
          usersResponse,
        ] = await Promise.all([
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

        const usersData =
          await usersResponse.json();

        if (!transactionsResponse.ok) {
          throw new Error(
            transactionsData?.message ||
              "Failed to load transactions"
          );
        }

        if (!usersResponse.ok) {
          throw new Error(
            usersData?.message ||
              "Failed to load users"
          );
        }

        const transactionList =
          Array.isArray(transactionsData)
            ? transactionsData
            : Array.isArray(
                transactionsData?.transactions
              )
            ? transactionsData.transactions
            : [];

        const userList = Array.isArray(usersData)
          ? usersData
          : Array.isArray(usersData?.users)
          ? usersData.users
          : [];

        setTransactions(transactionList);
        setUsers(userList);
      } catch (err) {
        console.error(
          "FETCH TRANSACTIONS ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load transactions"
        );

        setTransactions([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

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

    return user?.email || "N/A";
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

    return librarian?.email || "N/A";
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
                Transactions
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View payment and transaction records.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-lg bg-gray-200 px-3 py-2 text-xs font-bold text-gray-600">
              <FiCreditCard size={14} />

              {loading
                ? "Loading..."
                : `${transactions.length} Transactions`}
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
              Loading transactions...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          transactions.length === 0 &&
          !error && (
            <div className="mt-5 rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <FiCreditCard size={21} />
              </div>

              <h2 className="mt-4 text-base font-extrabold text-black">
                No Transactions Found
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                There are no payment records yet.
              </p>
            </div>
          )}

        {/* Transactions */}
        {!loading && transactions.length > 0 && (
          <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white">

            {/* Table Top */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
              <div>
                <h2 className="text-sm font-extrabold text-black">
                  Payment Records
                </h2>

                <p className="mt-0.5 text-[11px] text-gray-400">
                  Recent transaction information
                </p>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                <FiCreditCard size={15} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">

                {/* Table Head */}
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <TableHead>
                      Transaction
                    </TableHead>

                    <TableHead>
                      User
                    </TableHead>

                    <TableHead>
                      Librarian
                    </TableHead>

                    <TableHead>
                      Amount
                    </TableHead>

                    <TableHead>
                      Date
                    </TableHead>

                    <TableHead>
                      Status
                    </TableHead>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-100">
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

                      const rowKey =
                        transaction._id ||
                        transaction.transactionId ||
                        transaction.paymentId ||
                        transaction.sessionId ||
                        `transaction-${index}`;

                      return (
                        <tr
                          key={rowKey}
                          className="transition-colors hover:bg-gray-50/70"
                        >

                          {/* Transaction */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                                <FiHash size={14} />
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-[180px] truncate font-mono text-[11px] font-bold text-gray-700">
                                  {transactionId}
                                </p>

                                <p className="mt-0.5 text-[9px] text-gray-400">
                                  Transaction ID
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* User Email */}
                          <td className="px-4 py-3">
                            <div className="flex max-w-[210px] items-center gap-2">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                <FiUser size={12} />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-[11px] font-semibold text-gray-700">
                                  {getUserEmail(
                                    transaction
                                  )}
                                </p>

                                <p className="mt-0.5 text-[9px] text-gray-400">
                                  Customer
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Librarian */}
                          <td className="px-4 py-3">
                            <div className="flex max-w-[210px] items-center gap-2">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                <FiMail size={12} />
                              </div>

                              <span className="truncate text-[11px] font-semibold text-gray-700">
                                {getLibrarianEmail(
                                  transaction
                                )}
                              </span>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="px-4 py-3">
                            <p className="text-xs font-extrabold text-gray-900">
                              {formatAmount(
                                transaction.amount ||
                                  transaction.totalAmount ||
                                  transaction.deliveryFee
                              )}
                            </p>
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600">
                              <FiCalendar
                                size={12}
                                className="text-gray-400"
                              />

                              {formatDate(
                                transaction.createdAt ||
                                  transaction.date
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <TransactionStatus
                              status={status}
                              isPaid={isPaid}
                            />
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

/* Table Head */
function TableHead({ children }) {
  return (
    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">
      {children}
    </th>
  );
}

/* Transaction Status */
function TransactionStatus({
  status,
  isPaid,
}) {
  if (isPaid) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700">
        <FiCheckCircle size={11} />
        {formatStatus(status)}
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md bg-yellow-100 px-2 py-1 text-[10px] font-bold text-yellow-700">
        <FiClock size={11} />
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-red-100 px-2 py-1 text-[10px] font-bold text-red-700">
      <FiXCircle size={11} />
      {formatStatus(status)}
    </span>
  );
}

/* Format Status */
function formatStatus(status) {
  if (!status) {
    return "Unknown";
  }

  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}
