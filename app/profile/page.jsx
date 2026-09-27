"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function ProfileSettingsPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =========================================================
     LOAD USER DATA
  ========================================================= */
  useEffect(() => {
    if (!session?.user) return;

    setName(session.user.name || "");
    setImage(session.user.image || "");
  }, [session]);

  /* =========================================================
     SAVE PROFILE
  ========================================================= */
  const handleSave = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const trimmedName = name.trim();
    const trimmedImage = image.trim();

    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    try {
      setSaving(true);

      const { data, error: updateError } =
        await authClient.updateUser({
          name: trimmedName,
          image: trimmedImage || undefined,
        });

      if (updateError) {
        console.error("PROFILE UPDATE ERROR:", updateError);

        setError(
          updateError.message || "Failed to update profile."
        );

        return;
      }

      console.log("PROFILE UPDATED:", data);

      setMessage("Profile updated successfully.");

      /*
       * Give Better Auth session a moment to update,
       * then refresh the current page so Navbar also
       * receives the latest user information.
       */
      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch (err) {
      console.error("PROFILE UPDATE ERROR:", err);

      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */
  if (isPending) {
    return (
      <main className="min-h-screen bg-[#fffaf0] px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border-2 border-black bg-white p-8 shadow-[8px_9px_0_#111]">
            <div className="animate-pulse">
              <div className="mx-auto h-24 w-24 rounded-full bg-gray-200" />

              <div className="mx-auto mt-6 h-8 w-48 rounded bg-gray-200" />

              <div className="mx-auto mt-3 h-4 w-64 rounded bg-gray-200" />

              <div className="mt-10 h-12 rounded-xl bg-gray-200" />

              <div className="mt-4 h-12 rounded-xl bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     NOT LOGGED IN
  ========================================================= */
  if (!session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf0] px-4">
        <div className="w-full max-w-md rounded-3xl border-2 border-black bg-white p-8 text-center shadow-[8px_9px_0_#111]">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-black bg-[#fcc615]">
            <svg
              viewBox="0 0 48 48"
              className="h-12 w-12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="24"
                cy="17"
                r="8"
                fill="#fcc615"
                stroke="#111"
                strokeWidth="2.5"
              />

              <path
                d="M10 40c1.8-8.2 7-12 14-12s12.2 3.8 14 12"
                fill="#fc1d15"
                stroke="#111"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-2xl font-black text-black">
            Login Required
          </h1>

          <p className="mt-2 text-sm text-black/55">
            Please login to access your profile settings.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl border-2 border-black bg-[#fcc615] px-6 py-3 text-sm font-black text-black shadow-[4px_4px_0_#111] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#111]"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  const user = session.user;

  const firstName =
    user.name?.trim()?.split(" ")[0] ||
    user.email?.split("@")[0] ||
    "User";

  const initials =
    user.name
      ?.trim()
      ?.split(/\s+/)
      ?.map((part) => part[0])
      ?.join("")
      ?.slice(0, 2)
      ?.toUpperCase() ||
    user.email?.charAt(0)?.toUpperCase() ||
    "U";

  const role = user.role || "user";

  const roleLabel =
    role === "librarian"
      ? "Librarian"
      : role === "admin"
        ? "Admin"
        : "Reader";

  /* =========================================================
     PAGE
  ========================================================= */
  return (
    <main className="min-h-screen bg-[#fffaf0] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-black/60 transition-colors hover:text-black"
          >
            <span className="text-lg">←</span>
            Back to Home
          </Link>

          <div className="mt-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#fc1d15]">
              Account
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-black sm:text-4xl">
              Profile Settings
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-black/55 sm:text-base">
              Manage your personal information and profile photo.
            </p>
          </div>
        </div>

        {/* =====================================================
            PROFILE CARD
        ===================================================== */}
        <div className="overflow-hidden rounded-[28px] border-2 border-black bg-white shadow-[8px_9px_0_#111]">

          {/* ===================================================
              TOP PROFILE AREA
          =================================================== */}
          <div className="border-b-2 border-black bg-[#fcc615] px-6 py-8 sm:px-10">
            <div className="flex flex-col items-center gap-5 sm:flex-row">

              {/* Avatar */}
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_#111]">

                {image ? (
                  <img
                    src={image}
                    alt={user.name || "Profile"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#fc1d15] text-3xl font-black text-white">
                    {initials}
                  </div>
                )}
              </div>

              {/* User information */}
              <div className="min-w-0 text-center sm:text-left">
                <p className="text-2xl font-black text-black">
                  {firstName}
                </p>

                <p className="mt-1 break-all text-sm font-medium text-black/60">
                  {user.email}
                </p>

                <div className="mt-3 inline-flex rounded-full border-2 border-black bg-white px-4 py-1.5 text-xs font-black uppercase tracking-wide">
                  {roleLabel}
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================
              FORM
          =================================================== */}
          <form
            onSubmit={handleSave}
            className="space-y-6 px-6 py-8 sm:px-10 sm:py-10"
          >

            {/* Success */}
            {message && (
              <div className="rounded-2xl border-2 border-green-700 bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
                ✓ {message}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-2xl border-2 border-red-600 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                {error}
              </div>
            )}

            {/* =================================================
                NAME
            ================================================= */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-black text-black"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setMessage("");
                  setError("");
                }}
                placeholder="Enter your full name"
                autoComplete="name"
                disabled={saving}
                className="w-full rounded-2xl border-2 border-black bg-white px-4 py-3.5 text-sm font-medium text-black outline-none transition-all placeholder:text-black/35 focus:bg-[#fffaf0] focus:shadow-[4px_4px_0_#fcc615] disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>

            {/* =================================================
                EMAIL
            ================================================= */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-black text-black"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={user.email || ""}
                disabled
                className="w-full cursor-not-allowed rounded-2xl border-2 border-black/20 bg-gray-100 px-4 py-3.5 text-sm font-medium text-black/55"
              />

              <p className="mt-2 text-xs font-medium text-black/45">
                Your email address cannot be changed from profile settings.
              </p>
            </div>

            {/* =================================================
                PROFILE PHOTO
            ================================================= */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-black text-black"
              >
                Profile Photo URL
              </label>

              <input
                id="image"
                type="url"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                  setMessage("");
                  setError("");
                }}
                placeholder="https://example.com/profile.jpg"
                autoComplete="url"
                disabled={saving}
                className="w-full rounded-2xl border-2 border-black bg-white px-4 py-3.5 text-sm font-medium text-black outline-none transition-all placeholder:text-black/35 focus:bg-[#fffaf0] focus:shadow-[4px_4px_0_#fcc615] disabled:cursor-not-allowed disabled:bg-gray-100"
              />

              <p className="mt-2 text-xs font-medium text-black/45">
                Enter a public image URL for your profile photo.
              </p>
            </div>

            {/* =================================================
                ROLE
            ================================================= */}
            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-black text-black"
              >
                Account Type
              </label>

              <div
                id="role"
                className="flex items-center justify-between rounded-2xl border-2 border-black/20 bg-gray-100 px-4 py-3.5"
              >
                <span className="text-sm font-bold text-black/60">
                  {roleLabel}
                </span>

                <span className="rounded-lg bg-[#fcc615] px-3 py-1 text-xs font-black uppercase text-black">
                  {role}
                </span>
              </div>

              <p className="mt-2 text-xs font-medium text-black/45">
                Account type is managed separately and cannot be changed here.
              </p>
            </div>

            {/* =================================================
                DIVIDER
            ================================================= */}
            <div className="border-t-2 border-dashed border-black/15 pt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm font-black text-black">
                    Save your changes
                  </p>

                  <p className="mt-1 text-xs text-black/45">
                    Your updated information will be used across BiblioDrop.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl border-2 border-black bg-[#fc1d15] px-7 py-3.5 text-sm font-black text-white shadow-[4px_4px_0_#111] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#111] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

              </div>
            </div>
          </form>
        </div>

        {/* =====================================================
            FOOT NOTE
        ===================================================== */}
        <div className="mt-6 text-center">
          <p className="text-xs font-medium text-black/40">
            BiblioDrop • Your Local Library, Delivered
          </p>
        </div>
      </div>
    </main>
  );
}