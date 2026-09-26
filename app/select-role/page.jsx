"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SelectRolePage() {
    const router = useRouter();

    const [role, setRole] = useState("user");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleContinue = async () => {
        setError("");

        try {
            setLoading(true);

            const response = await fetch("/api/user/role", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ role }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to save role"
                );
            }

            if (role === "librarian") {
                router.push("/dashboard/librarian");
            } else {
                router.push("/dashboard/user");
            }
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fffdf8] px-4 py-6">
            {/* ================= Background ================= */}
            <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-[#fc1d15]/[0.045] blur-3xl" />

            <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#fcc615]/[0.09] blur-3xl" />

            <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-[#fc1d15]/[0.025] blur-3xl" />

            {/* ================= Card ================= */}
            <div className="relative w-full max-w-md">
                <div className="overflow-hidden rounded-[26px] border border-black/[0.06] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.08)]">
                    {/* Top accent */}
                    <div className="h-1.5 bg-gradient-to-r from-[#fc1d15] via-[#fc1d15] to-[#fcc615]" />

                    <div className="p-5 sm:p-6">
                        {/* ================= Header ================= */}
                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-black shadow-[4px_4px_0_#fcc615]">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-6 w-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                >
                                    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5Z" />
                                    <path d="M4 5.5v16" />
                                    <path d="M8 7h8" />
                                    <path d="M8 11h8" />
                                    <path d="M8 15h5" />
                                </svg>
                            </div>

                            <p className="mt-4 text-[9px] font-black uppercase tracking-[0.2em] text-[#fc1d15]">
                                BiblioDrop
                            </p>

                            <h1 className="mt-1.5 text-2xl font-black tracking-tight text-black sm:text-[27px]">
                                Welcome to BiblioDrop
                            </h1>

                            <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-gray-500">
                                Choose how you want to use BiblioDrop.
                            </p>
                        </div>

                        {/* ================= Error ================= */}
                        {error && (
                            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#fc1d15]/10 bg-[#fc1d15]/[0.05] px-3.5 py-3 animate-[fadeIn_.25s_ease-out]">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#fc1d15] text-white">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-3.5 w-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                    >
                                        <path d="M12 8v4" />
                                        <path d="M12 16h.01" />
                                        <circle cx="12" cy="12" r="9" />
                                    </svg>
                                </div>

                                <p className="pt-0.5 text-[10px] font-semibold leading-4 text-[#fc1d15]">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* ================= Roles ================= */}
                        <div className="mt-5 space-y-2.5">
                            {/* User */}
                            <button
                                type="button"
                                onClick={() => {
                                    setRole("user");
                                    setError("");
                                }}
                                disabled={loading}
                                className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${role === "user"
                                        ? "border-[#fc1d15]/30 bg-[#fc1d15]/[0.045] shadow-[4px_4px_0_#fcc615]"
                                        : "border-black/[0.08] bg-white hover:-translate-y-0.5 hover:border-black/15 hover:bg-[#fafafa]"
                                    } ${loading
                                        ? "cursor-not-allowed opacity-70"
                                        : ""
                                    }`}
                            >
                                {/* Active glow */}
                                {role === "user" && (
                                    <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#fc1d15]/10 blur-2xl" />
                                )}

                                <div className="relative flex items-center gap-3">
                                    {/* Icon */}
                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${role === "user"
                                                ? "bg-[#fc1d15] text-white shadow-[3px_3px_0_#fcc615]"
                                                : "bg-gray-100 text-gray-500 group-hover:bg-black group-hover:text-white"
                                            }`}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        >
                                            <circle cx="12" cy="8" r="3.2" />
                                            <path d="M5 20c.7-3.5 3.1-5.5 7-5.5s6.3 2 7 5.5" />
                                        </svg>
                                    </div>

                                    {/* Content */}
                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-sm font-black text-black">
                                            User
                                        </h2>

                                        <p className="mt-0.5 text-[10px] leading-4 text-gray-500">
                                            Browse books, request deliveries and write
                                            reviews.
                                        </p>
                                    </div>

                                    {/* Radio */}
                                    <div
                                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${role === "user"
                                                ? "border-[#fc1d15]"
                                                : "border-gray-300"
                                            }`}
                                    >
                                        {role === "user" && (
                                            <span className="h-2.5 w-2.5 rounded-full bg-[#fc1d15] animate-[scaleIn_.2s_ease-out]" />
                                        )}
                                    </div>
                                </div>
                            </button>

                            {/* Librarian */}
                            <button
                                type="button"
                                onClick={() => {
                                    setRole("librarian");
                                    setError("");
                                }}
                                disabled={loading}
                                className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${role === "librarian"
                                        ? "border-[#fc1d15]/30 bg-[#fc1d15]/[0.045] shadow-[4px_4px_0_#fcc615]"
                                        : "border-black/[0.08] bg-white hover:-translate-y-0.5 hover:border-black/15 hover:bg-[#fafafa]"
                                    } ${loading
                                        ? "cursor-not-allowed opacity-70"
                                        : ""
                                    }`}
                            >
                                {/* Active glow */}
                                {role === "librarian" && (
                                    <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#fcc615]/20 blur-2xl" />
                                )}

                                <div className="relative flex items-center gap-3">
                                    {/* Icon */}
                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${role === "librarian"
                                                ? "bg-[#fc1d15] text-white shadow-[3px_3px_0_#fcc615]"
                                                : "bg-gray-100 text-gray-500 group-hover:bg-black group-hover:text-white"
                                            }`}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-5 w-5"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                        >
                                            <path d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" />
                                            <path d="M4 19c0-1.1.9-2 2-2h14" />
                                            <path d="M8 7h8" />
                                            <path d="M8 11h6" />
                                            <path d="M8 15h4" />
                                        </svg>
                                    </div>

                                    {/* Content */}
                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-sm font-black text-black">
                                            Librarian
                                        </h2>

                                        <p className="mt-0.5 text-[10px] leading-4 text-gray-500">
                                            Add books, manage inventory and handle
                                            deliveries.
                                        </p>
                                    </div>

                                    {/* Radio */}
                                    <div
                                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${role === "librarian"
                                                ? "border-[#fc1d15]"
                                                : "border-gray-300"
                                            }`}
                                    >
                                        {role === "librarian" && (
                                            <span className="h-2.5 w-2.5 rounded-full bg-[#fc1d15] animate-[scaleIn_.2s_ease-out]" />
                                        )}
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* ================= Selected Role ================= */}
                        <div className="mt-4 flex items-center justify-between rounded-xl bg-[#fafafa] px-3.5 py-2.5">
                            <span className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                                Selected Role
                            </span>

                            <span className="text-[10px] font-black capitalize text-black">
                                {role}
                            </span>
                        </div>

                        {/* ================= Continue ================= */}
                        <button
                            type="button"
                            onClick={handleContinue}
                            disabled={loading}
                            className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#fc1d15] px-5 py-3 text-xs font-black text-white shadow-[4px_4px_0_#fcc615] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#fcc615] active:translate-y-0 active:shadow-[2px_2px_0_#fcc615] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                        >
                            {loading ? (
                                <>
                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                    Please wait...
                                </>
                            ) : (
                                <>
                                    Continue as {role}

                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M5 12h14" />
                                        <path d="m13 6 6 6-6 6" />
                                    </svg>
                                </>
                            )}
                        </button>

                        <p className="mt-3 text-center text-[9px] leading-4 text-gray-400">
                            You can use BiblioDrop according to the role you
                            select.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
        </main>
    );
}
