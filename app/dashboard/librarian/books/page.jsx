"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiBookOpen,
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiArrowUpRight,
  FiCheckCircle,
  FiClock,
  FiX,
  FiSearch,
  FiLayers,
} from "react-icons/fi";

const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    status: "Available",
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    status: "Checked Out",
  },
];

export default function ManageBooks() {
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = (message) => {
    setToast(message);
  };

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffdf8] px-3 py-5 sm:px-5">
      <div className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-[#fc1d15]/[0.04] blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-0 h-48 w-48 rounded-full bg-[#fcc615]/[0.07] blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-1.5">
              <span className="h-1 w-5 rounded-full bg-[#fc1d15]" />

              <span className="text-[8px] font-black uppercase tracking-[0.18em] text-[#fc1d15]">
                Inventory
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-black sm:text-3xl">
              Manage <span className="text-[#fc1d15]">Books</span>
            </h1>

            <p className="mt-1 text-[11px] text-gray-400">
              Manage your library collection.
            </p>
          </div>

          <Link
            href="/dashboard/librarian/add-book"
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-black px-3 py-2 text-[10px] font-black text-white shadow-[3px_3px_0_#fcc615] transition-all duration-300 hover:bg-[#fc1d15]"
          >
            <FiPlus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
            Add Book
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-black/[0.06] bg-white p-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fc1d15]/10 text-[#fc1d15]">
                <FiBookOpen className="h-3.5 w-3.5" />
              </div>

              <span className="text-lg font-black text-black">
                {books.length}
              </span>
            </div>

            <p className="mt-2 text-[8px] font-black uppercase tracking-wider text-gray-400">
              Total
            </p>
          </div>

          <div className="rounded-xl border border-black/[0.06] bg-white p-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <FiCheckCircle className="h-3.5 w-3.5" />
              </div>

              <span className="text-lg font-black text-black">
                {books.filter((b) => b.status === "Available").length}
              </span>
            </div>

            <p className="mt-2 text-[8px] font-black uppercase tracking-wider text-gray-400">
              Available
            </p>
          </div>

          <div className="rounded-xl bg-black p-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fcc615] text-black">
                <FiClock className="h-3.5 w-3.5" />
              </div>

              <span className="text-lg font-black text-white">
                {books.filter((b) => b.status !== "Available").length}
              </span>
            </div>

            <p className="mt-2 text-[8px] font-black uppercase tracking-wider text-gray-500">
              Checked Out
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 rounded-xl border border-black/[0.06] bg-white p-2 shadow-sm">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books..."
              className="w-full rounded-lg border border-gray-200 bg-[#fffdf9] py-2 pl-9 pr-3 text-[11px] font-medium outline-none transition focus:border-[#fc1d15]/40 focus:ring-2 focus:ring-[#fc1d15]/[0.05]"
            />
          </div>
        </div>

        {/* Collection */}
        <div className="mt-5">
          <div className="mb-2.5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-black">
                Your Collection
              </h2>

              <p className="text-[9px] text-gray-400">
                {filteredBooks.length} books found
              </p>
            </div>

            <FiLayers className="h-4 w-4 text-[#fc1d15]" />
          </div>

          {filteredBooks.length > 0 ? (
            <div className="grid gap-2.5 md:grid-cols-2">
              {filteredBooks.map((book, index) => {
                const isAvailable = book.status === "Available";

                return (
                  <article
                    key={book.id}
                    className="group relative overflow-hidden rounded-[15px] border border-black/[0.06] bg-white p-2.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    style={{
                      animation: `manageBookIn .4s ease-out ${
                        index * 70
                      }ms both`,
                    }}
                  >
                    <div
                      className={`absolute left-0 top-0 h-0.5 w-full ${
                        isAvailable ? "bg-emerald-500" : "bg-[#fc1d15]"
                      }`}
                    />

                    <div className="flex gap-2.5">
                      {/* Small cover */}
                      <div className="flex h-[78px] w-[58px] shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#fff8e5] to-[#f5f2ec]">
                        <FiBookOpen className="h-6 w-6 text-[#fc1d15] transition-transform duration-300 group-hover:scale-110" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[7px] font-black uppercase tracking-wider text-[#fc1d15]">
                              {book.category}
                            </span>

                            <h3 className="mt-0.5 truncate text-[12px] font-black text-gray-900">
                              {book.title}
                            </h3>

                            <p className="mt-0.5 truncate text-[9px] text-gray-400">
                              {book.author}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-1.5 py-0.5 text-[7px] font-black ${
                              isAvailable
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-red-50 text-[#fc1d15]"
                            }`}
                          >
                            {isAvailable ? "Available" : "Checked Out"}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              handleAction(`Editing "${book.title}"`)
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-[8px] font-black text-gray-600 transition hover:bg-black hover:text-white"
                          >
                            <FiEdit3 className="h-2.5 w-2.5" />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleAction(`Delete action for "${book.title}"`)
                            }
                            className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 text-[8px] font-black text-[#fc1d15] transition hover:bg-[#fc1d15] hover:text-white"
                          >
                            <FiTrash2 className="h-2.5 w-2.5" />
                            Delete
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleAction(`Viewing "${book.title}"`)
                            }
                            className="ml-auto flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:border-[#fcc615] hover:bg-[#fcc615] hover:text-black"
                          >
                            <FiArrowUpRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-10 text-center">
              <FiSearch className="mx-auto h-5 w-5 text-[#fc1d15]" />

              <p className="mt-2 text-xs font-black text-gray-700">
                No books found
              </p>

              <p className="mt-1 text-[9px] text-gray-400">
                Try another search.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-xs -translate-x-1/2 animate-[manageToast_.25s_ease-out]">
          <div className="flex items-center gap-2 rounded-xl bg-black px-3 py-2.5 text-white shadow-lg">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fcc615] text-black">
              <FiCheckCircle className="h-3.5 w-3.5" />
            </div>

            <p className="text-[9px] font-bold">{toast}</p>

            <button
              type="button"
              onClick={() => setToast("")}
              className="ml-auto text-gray-400 hover:text-white"
            >
              <FiX className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}