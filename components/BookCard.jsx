"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiBookmark,
  FiCheck,
  FiHeart,
  FiShoppingBag,
} from "react-icons/fi";

export default function BookCard({ book }) {
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 2200);

    return () => clearTimeout(timer);
  }, [toast]);

  const status = book?.status?.toLowerCase();

  const isAvailable = status === "available";
  const isOutOfStock =
    status === "out_of_stock" || status === "out-of-stock";

  const getStatus = () => {
    if (isAvailable) {
      return {
        label: "Available",
        dot: "bg-emerald-500",
        text: "text-emerald-600",
        bg: "bg-emerald-50",
      };
    }

    if (isOutOfStock) {
      return {
        label: "Out of Stock",
        dot: "bg-orange-500",
        text: "text-orange-600",
        bg: "bg-orange-50",
      };
    }

    return {
      label: "Unavailable",
      dot: "bg-gray-400",
      text: "text-gray-500",
      bg: "bg-gray-100",
    };
  };

  const statusInfo = getStatus();

  const handleSave = () => {
    const next = !saved;

    setSaved(next);
    setToast(
      next
        ? "Book added to your saved list"
        : "Book removed from your saved list"
    );
  };

  return (
    <>
      <article className="group bg-[#ffebe19d] rounded-[10px] p-2 border border-[#bcbcbc42] relative w-full max-w-[205px]">

        {/* Cover */}
        <div
          className="
            relative aspect-[3/4]
            overflow-hidden
            rounded-[10px]
            bg-[#fdfdfc]
          "
        >
          {book?.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="
    h-[92%] w-[92%]
    mx-auto my-auto
    object-cover
    rounded-lg
    transition-transform duration-500
    group-hover:scale-[1.035]
  "
            />


          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <FiShoppingBag className="mx-auto h-6 w-6 text-gray-300" />
                <p className="mt-1 text-[8px] font-semibold text-gray-400">
                  No Cover
                </p>
              </div>
            </div>
          )}

          {/* Gradient */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Status */}
          <div className="absolute left-2 top-2">
            <span
              className={`
                inline-flex items-center gap-1
                rounded-full
                px-1.5 py-[3px]
                text-[7px]
                font-bold
                ${statusInfo.bg}
                ${statusInfo.text}
              `}
            >
              <span
                className={`h-1 w-1 rounded-full ${statusInfo.dot}`}
              />
              {statusInfo.label}
            </span>
          </div>

          {/* Bookmark */}
          <button
            type="button"
            onClick={handleSave}
            aria-label={saved ? "Remove from saved books" : "Save book"}
            className={`
              absolute right-2 top-2
              flex h-6 w-6
              items-center justify-center
              rounded-full
              bg-white
              shadow-sm
              transition-all duration-300
              hover:scale-105
              ${saved
                ? "bg-[#fc1d15] text-white"
                : "text-gray-600 hover:bg-black hover:text-white"
              }
            `}
          >
            {saved ? (
              <FiBookmark className="h-3 w-3 fill-current" />
            ) : (
              <FiHeart className="h-3 w-3" />
            )}
          </button>

          {/* Category */}
          {book?.category && (
            <div className="absolute bottom-2 left-2">
              <span className="rounded bg-white/90 px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider text-gray-800 backdrop-blur">
                {book.category}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pt-2">

          {/* Title */}
          <h2
            className="
              line-clamp-2
              min-h-[30px]
              text-[12px]
              font-bold
              leading-[1.25]
              tracking-[-0.01em]
              text-gray-900
              transition-colors duration-300
              group-hover:text-[#fc1d15]
            "
          >
            {book?.title || "Untitled Book"}
          </h2>

          {/* Author */}
          <p className="mt-0.5 truncate text-[9px] font-medium text-gray-500">
            {book?.author || "Unknown Author"}
          </p>

          {/* Bottom */}
          <div className="mt-2 flex items-center justify-between gap-1.5">

            {/* Delivery */}
            <div>
              <p className="text-[7px] font-medium uppercase tracking-wide text-gray-400">
                Delivery
              </p>

              <p className="mt-[1px] text-[11px] font-extrabold text-gray-900">
                ₹{book?.deliveryFee ?? 0}
              </p>
            </div>

            {/* Action */}
            {isAvailable ? (
              <Link
                href={`/books/${book._id}`}
                className="
                  rounded-md
                  bg-black
                  px-2
                  py-1.5
                  text-[8px]
                  font-bold
                  text-white
                  transition-all
                  duration-300
                  hover:bg-[#fc1d15]
                "
              >
                View Book
              </Link>
            ) : isOutOfStock ? (
              <Link
                href={`/books/${book._id}`}
                className="
                  rounded-md
                  border
                  border-gray-200
                  bg-white
                  px-2
                  py-1.5
                  text-[8px]
                  font-bold
                  text-gray-600
                  transition-all
                  hover:border-gray-300
                "
              >
                Details
              </Link>
            ) : (
              <span
                className="
                  rounded-md
                  bg-gray-100
                  px-2
                  py-1.5
                  text-[8px]
                  font-bold
                  text-gray-400
                "
              >
                Unavailable
              </span>
            )}
          </div>
        </div>

        {/* Hover Line */}
        <div className="mt-1.5 h-[2px] w-0 rounded-full bg-[#fc1d15] transition-all duration-500 group-hover:w-7" />
      </article>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 z-[100] w-[calc(100%-28px)] max-w-xs -translate-x-1/2">
          <div className="flex items-center gap-2.5 rounded-xl bg-black px-3 py-2.5 text-white shadow-xl">

            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fcc615] text-black">
              {saved ? (
                <FiCheck className="h-3.5 w-3.5" />
              ) : (
                <FiBookmark className="h-3.5 w-3.5" />
              )}
            </div>

            <p className="text-[9px] font-semibold">
              {toast}
            </p>

            <button
              type="button"
              onClick={() => setToast("")}
              className="ml-auto text-base leading-none text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
