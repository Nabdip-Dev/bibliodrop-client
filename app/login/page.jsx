"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      email,
      password,
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-md">

        <div className="rounded-3xl border bg-white p-8 shadow-sm">

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">
              Welcome Back
            </h1>

            <p className="mt-2 text-gray-500">
              Login to your BiblioDrop account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-black px-5 py-3 font-semibold text-white hover:opacity-80"
            >
              Login
            </button>

          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <button
            type="button"
            className="w-full rounded-xl border px-5 py-3 font-medium hover:bg-gray-50"
          >
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Dont have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-black hover:underline"
            >
              Create Account
            </Link>
          </p>

        </div>

      </div>
    </main>
  );
}