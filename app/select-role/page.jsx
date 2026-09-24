"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

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
                throw new Error(data.message || "Failed to save role");
            }

            if (role === "librarian") {
                router.push("/dashboard/librarian");
            } else {
                router.push("/dashboard/user");
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome to BiblioDrop
                    </h1>

                    <p className="text-gray-500 mt-2">
                        How do you want to use BiblioDrop?
                    </p>
                </div>

                {error && (
                    <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="space-y-4">

                    {/* User */}
                    <button
                        type="button"
                        onClick={() => setRole("user")}
                        className={`w-full text-left border rounded-xl p-5 transition ${role === "user"
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                    >
                        <h2 className="font-bold text-lg">
                            User
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Browse books, request deliveries and write reviews.
                        </p>
                    </button>

                    {/* Librarian */}
                    <button
                        type="button"
                        onClick={() => setRole("librarian")}
                        className={`w-full text-left border rounded-xl p-5 transition ${role === "librarian"
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                    >
                        <h2 className="font-bold text-lg">
                            Librarian
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Add books, manage inventory and handle deliveries.
                        </p>
                    </button>

                </div>

                <button
                    type="button"
                    onClick={handleContinue}
                    disabled={loading}
                    className="w-full mt-7 bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                >
                    {loading ? "Please wait..." : "Continue"}
                </button>

            </div>
        </main>
    );
}