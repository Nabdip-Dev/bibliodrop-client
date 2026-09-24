"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiHeart,
  FiArrowUpRight,
  FiBookOpen,
  FiCheck,
  FiClock,
  FiBookmark,
} from "react-icons/fi";

export default function BookCard({ book }) {
  const isAvailable = book.status === "available";

  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 2200);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleSave = () => {
    setSaved((prev) => !prev);

    setToast(
      saved
        ? "Removed from your saved books"
        : "Book saved successfully"
    );
  };

  return (
    <>
      <article className="group relative overflow-hidden rounded-[18px] border border-black/[0.07] bg-white p-2.5 shadow-[0_6px_25px_rgba(0,0,0,0.045)] transition-all duration-500 hover:-translate-y-1 hover:border-[#fc1d15]/20 hover:shadow-[0_15px_35px_rgba(0,0,0,0.09)]">
        {/* Top Accent */}
        <div className="absolute left-1/2 top-0 z-10 h-[3px] w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#fc1d15] to-[#fcc615] transition-all duration-500 group-hover:w-16" />

        {/* Cover */}
        <div className="relative h-[190px] overflow-hidden rounded-[14px] bg-gradient-to-br from-[#faf9f6] to-[#fff5dc]">
          {/* Soft decoration */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#fcc615]/15 blur-xl transition-transform duration-700 group-hover:scale-150" />

          <div className="pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-[#fc1d15]/10 blur-xl transition-transform duration-700 group-hover:scale-125" />

          {/* Book Image */}
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="relative z-[1] h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#fc1d15] shadow-md transition-transform duration-500 group-hover:scale-105">
                <FiBookOpen className="h-8 w-8" />
              </div>
            </div>
          )}

          {/* Availability - LEFT */}
          <div className="absolute left-2.5 top-2.5 z-20">
            {isAvailable ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-emerald-600 shadow-sm backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Available
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#fc1d15] shadow-sm backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[#fc1d15]" />
                Unavailable
              </span>
            )}
          </div>

          {/* Save - RIGHT */}
          <button
            type="button"
            onClick={handleSave}
            aria-label={saved ? "Remove from saved books" : "Save book"}
            className={`absolute right-2.5 top-2.5 z-20 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-all duration-300 ${
              saved
                ? "border-[#fc1d15] bg-[#fc1d15] text-white scale-105"
                : "border-white/70 bg-white/95 text-gray-700 hover:scale-105 hover:bg-[#fc1d15] hover:text-white"
            }`}
          >
            {saved ? (
              <FiBookmark className="h-3.5 w-3.5" />
            ) : (
              <FiHeart className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="px-1 pt-3 pb-1">
          {/* Category */}
          {book.category && (
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-[#fc1d15]" />

              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#fc1d15]">
                {book.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 className="line-clamp-1 text-[15px] font-extrabold tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-[#fc1d15]">
            {book.title}
          </h2>

          {/* Author */}
          <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-gray-500">
            {book.author}
          </p>

          {/* Description */}
          {book.description && (
            <p className="mt-2 line-clamp-1 text-[10px] leading-4 text-gray-400">
              {book.description}
            </p>
          )}

          {/* Bottom */}
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-black/[0.06] pt-3">
            {/* Fee */}
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                Delivery
              </p>

              <p className="mt-0.5 text-sm font-black text-gray-900">
                ₹{book.deliveryFee}
              </p>
            </div>

            {/* Details */}
            <Link
              href={`/books/${book._id}`}
              className="group/details inline-flex items-center gap-1.5 rounded-xl bg-black px-3 py-2 text-[10px] font-bold text-white transition-all duration-300 hover:bg-[#fc1d15]"
            >
              Details

              <FiArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/details:translate-x-0.5 group-hover/details:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Bottom Hover Line */}
        <div className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-[#fcc615] transition-all duration-500 group-hover:w-20" />
      </article>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[100] w-[calc(100%-32px)] max-w-xs -translate-x-1/2 animate-[cardToast_.3s_ease-out]">
          <div className="flex items-center gap-3 rounded-2xl bg-black px-3.5 py-3 text-white shadow-[0_15px_40px_rgba(0,0,0,0.2)]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#fcc615] text-black">
              {saved ? (
                <FiCheck className="h-4 w-4" />
              ) : (
                <FiBookmark className="h-4 w-4" />
              )}
            </div>

            <p className="text-[11px] font-semibold leading-4">
              {toast}
            </p>

            <button
              type="button"
              onClick={() => setToast("")}
              className="ml-auto text-lg leading-none text-gray-400 transition hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}