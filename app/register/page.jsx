"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    photo: "",
    role: "user",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log(form);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-lg">

        <div className="rounded-3xl border bg-white p-8 shadow-sm">

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">
              Create Account
            </h1>

            <p className="mt-2 text-gray-500">
              Join BiblioDrop today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
              />
            </div>

            {/* Photo */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Photo URL
              </label>

              <input
                type="url"
                name="photo"
                placeholder="https://example.com/photo.jpg"
                value={form.photo}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
              />
            </div>

            {/* Role */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Choose Role
              </label>

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-xl border px-4 py-3 outline-none"
              >
                <option value="user">
                  User / Reader
                </option>

                <option value="librarian">
                  Librarian
                </option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-black px-5 py-3 font-semibold text-white hover:opacity-80"
            >
              Create Account
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
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-black hover:underline"
            >
              Login
            </Link>
          </p>

        </div>

      </div>
    </main>
  );
}