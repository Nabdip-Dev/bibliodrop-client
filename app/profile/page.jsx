"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // LOAD CURRENT USER
  // =========================================================

  useEffect(() => {
    if (!session?.user) return;

    setName(session.user.name || "");
    setImage(session.user.image || "");
  }, [session]);

  // =========================================================
  // USER DATA
  // =========================================================

  const user = session?.user;

  const initials =
    user?.name
      ?.trim()
      ?.split(/\s+/)
      ?.map((part) => part.charAt(0))
      ?.join("")
      ?.slice(0, 2)
      ?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  const role = user?.role || "user";

  const roleLabel =
    role === "admin"
      ? "Admin"
      : role === "librarian"
        ? "Librarian"
        : "Reader";

  // =========================================================
  // IMGBB IMAGE UPLOAD
  // =========================================================

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setMessage("");
    setError("");

    // -------------------------------------------------------
    // Validate file type
    // -------------------------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please select a JPG, PNG, WEBP or GIF image."
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    // -------------------------------------------------------
    // Validate file size
    // -------------------------------------------------------

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    // -------------------------------------------------------
    // Get ImgBB API key
    // -------------------------------------------------------

    const apiKey =
      process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      setError(
        "ImgBB API key is missing. Please check your environment variables."
      );

      console.error(
        "NEXT_PUBLIC_IMGBB_API_KEY is missing."
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    try {
      setUploading(true);

      // -----------------------------------------------------
      // Prepare ImgBB FormData
      // -----------------------------------------------------

      const formData = new FormData();

      formData.append("key", apiKey);
      formData.append("image", file);

      // -----------------------------------------------------
      // Upload directly to ImgBB
      // -----------------------------------------------------

      const response = await fetch(
        "https://api.imgbb.com/1/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      console.log(
        "IMGBB UPLOAD RESPONSE:",
        result
      );

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error?.message ||
          "Image upload failed."
        );
      }

      // -----------------------------------------------------
      // Get final hosted image URL
      // -----------------------------------------------------

      const uploadedImage =
        result?.data?.display_url ||
        result?.data?.url;

      if (!uploadedImage) {
        throw new Error(
          "ImgBB did not return an image URL."
        );
      }

      // -----------------------------------------------------
      // Set image URL
      // -----------------------------------------------------

      setImage(uploadedImage);

      setMessage(
        "Profile photo uploaded successfully. Click Save Changes to update your profile."
      );
    } catch (err) {
      console.error(
        "PROFILE IMAGE UPLOAD ERROR:",
        err
      );

      setError(
        err?.message ||
        "Failed to upload profile photo."
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // =========================================================
  // REMOVE PHOTO
  // =========================================================

  const handleRemovePhoto = () => {
    setImage("");
    setMessage("");
    setError("");
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  const handleSave = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const cleanName = name.trim();
    const cleanImage = image.trim();

    // -------------------------------------------------------
    // Validate name
    // -------------------------------------------------------

    if (!cleanName) {
      setError("Please enter your name.");
      return;
    }

    try {
      setSaving(true);

      // -----------------------------------------------------
      // Update Better Auth user
      // -----------------------------------------------------

      const { error: updateError } =
        await authClient.updateUser({
          name: cleanName,
          image: cleanImage || null,
        });

      if (updateError) {
        console.error(
          "PROFILE UPDATE ERROR:",
          updateError
        );

        setError(
          updateError.message ||
          "Failed to update profile."
        );

        return;
      }

      // -----------------------------------------------------
      // Refresh session
      // -----------------------------------------------------

      await authClient.getSession();

      setMessage(
        "Profile updated successfully."
      );

      router.refresh();
    } catch (err) {
      console.error(
        "PROFILE UPDATE ERROR:",
        err
      );

      setError(
        err?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOGIN REQUIRED
  // =========================================================

  if (!isPending && !session?.user) {
    return (
      <main className="min-h-screen bg-[#f6f6f3] px-4 py-10">
        <div className="mx-auto max-w-xl">
          <div className="rounded-[28px] border border-black/[0.06] bg-white p-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fcc615] text-2xl font-black text-black">
              !
            </div>

            <h1 className="mt-5 text-2xl font-black text-black">
              Login Required
            </h1>

            <p className="mt-2 text-sm text-black/45">
              Please login to access your profile settings.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-flex rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-[#fc1d15]"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (isPending) {
    return (
      <main className="min-h-screen bg-[#f6f6f3] px-4 py-8 sm:px-6 lg:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="animate-pulse rounded-[28px] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
            <div className="h-8 w-48 rounded-lg bg-gray-200" />

            <div className="mt-6 flex items-center gap-4">
              <div className="h-24 w-24 rounded-full bg-gray-200" />

              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-gray-200" />
                <div className="h-3 w-56 rounded bg-gray-200" />
              </div>
            </div>

            <div className="mt-8 h-12 rounded-xl bg-gray-200" />
            <div className="mt-4 h-12 rounded-xl bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <main className="min-h-screen bg-[#f6f6f3] px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-3xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-8 rounded-full bg-[#fc1d15]" />

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#fc1d15]">
              Account
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
            Profile{" "}
            <span className="text-[#fc1d15]">
              Settings
            </span>
          </h1>

          <p className="mt-2 text-sm text-black/45">
            Manage your personal information and profile photo.
          </p>
        </div>

        {/* =================================================
            CARD
        ================================================= */}

        <div className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_15px_50px_rgba(0,0,0,0.06)]">

          {/* =================================================
              PROFILE HEADER
          ================================================= */}

          <div className="relative overflow-hidden bg-[#fffdf8] p-6 sm:p-8">

            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#fcc615]/15 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-[#fc1d15]/[0.05] blur-3xl" />

            <div className="relative flex flex-col items-center sm:flex-row sm:items-center">

              {/* =================================================
                  PROFILE PHOTO
              ================================================= */}

              <div className="relative">

                <div className="group relative h-28 w-28">

                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#fcc615] text-3xl font-black text-black shadow-[0_10px_30px_rgba(0,0,0,0.12)]">

                    {image ? (
                      <img
                        src={image}
                        alt={
                          name ||
                          "Profile photo"
                        }
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      initials
                    )}

                  </div>

                  {/* =================================================
                      CHANGE OVERLAY
                  ================================================= */}

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={
                      uploading || saving
                    }
                    className="absolute inset-2 rounded-full bg-black/70 text-[10px] font-black text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 disabled:opacity-50"
                  >
                    {uploading
                      ? "Uploading..."
                      : "Change"}
                  </button>

                </div>

                {/* =================================================
                    UPLOAD BUTTON
                ================================================= */}

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={
                    uploading || saving
                  }
                  className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-black text-white shadow-md transition-all duration-200 hover:scale-110 hover:bg-[#fc1d15] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Upload profile photo"
                >
                  {uploading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 16V4" />
                      <path d="m7 9 5-5 5 5" />
                      <path d="M5 20h14" />
                    </svg>
                  )}
                </button>

                {/* =================================================
                    HIDDEN FILE INPUT
                ================================================= */}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* =================================================
                  USER INFO
              ================================================= */}

              <div className="mt-5 text-center sm:ml-6 sm:mt-0 sm:text-left">

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#fc1d15]">
                  Your Account
                </p>

                <h2 className="mt-1 max-w-[280px] truncate text-2xl font-black text-black">
                  {user?.name ||
                    "Your Name"}
                </h2>

                <p className="mt-1 max-w-[280px] truncate text-sm text-black/45">
                  {user?.email}
                </p>

                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f2] px-3 py-1.5 text-[10px] font-bold text-black/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                  {roleLabel}
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-[10px] text-black/25 sm:text-left">
              Click the camera button to upload a new profile photo.
            </p>

          </div>

          <div className="h-px bg-black/[0.06]" />

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSave}
            className="p-6 sm:p-8"
          >

            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {message && (
              <div className="mb-5 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-semibold text-green-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                  ✓
                </span>

                <span>{message}</span>
              </div>
            )}

            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (
              <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                  !
                </span>

                <span>{error}</span>
              </div>
            )}

            {/* =================================================
                NAME
            ================================================= */}

            <div>
              <label
                htmlFor="profile-name"
                className="mb-2 block text-xs font-black uppercase tracking-wider text-black/45"
              >
                Full Name
              </label>

              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter your full name"
                disabled={
                  saving || uploading
                }
                className="w-full rounded-xl border border-black/[0.08] bg-[#fafafa] px-4 py-3.5 text-sm font-semibold text-black outline-none transition focus:border-[#fc1d15] focus:bg-white focus:ring-4 focus:ring-[#fc1d15]/5 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="mt-5">

              <label
                htmlFor="profile-email"
                className="mb-2 block text-xs font-black uppercase tracking-wider text-black/45"
              >
                Email
              </label>

              <input
                id="profile-email"
                type="email"
                value={
                  user?.email || ""
                }
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-black/[0.06] bg-gray-100 px-4 py-3.5 text-sm font-semibold text-black/40"
              />

              <p className="mt-2 text-[11px] text-black/30">
                Email is managed by your authentication account.
              </p>

            </div>

            {/* =================================================
                IMAGE URL DISPLAY
            ================================================= */}

            {image && (
              <div className="mt-5 rounded-2xl border border-black/[0.06] bg-[#fafafa] p-4">

                <div className="flex items-center gap-4">

                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-200">

                    <img
                      src={image}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-xs font-black text-black">
                      Profile Photo
                    </p>

                    <p className="mt-1 truncate text-[10px] text-black/35">
                      Image uploaded to ImgBB
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={
                      saving || uploading
                    }
                    className="shrink-0 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove
                  </button>

                </div>
              </div>
            )}

            {/* =================================================
                ROLE
            ================================================= */}

            <div className="mt-5">

              <div className="flex items-center justify-between rounded-xl bg-[#fafafa] px-4 py-3.5">

                <span className="text-sm font-semibold text-black/45">
                  Current Role
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-black/50 shadow-sm">
                  {roleLabel}
                </span>

              </div>

            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <Link
                href="/dashboard"
                className="text-center text-xs font-bold text-black/40 transition hover:text-[#fc1d15]"
              >
                ← Back to Dashboard
              </Link>

              <button
                type="submit"
                disabled={
                  saving || uploading
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-7 py-3.5 text-sm font-black text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#fc1d15] hover:shadow-[5px_5px_0_#fcc615] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </>
                ) : uploading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Uploading...
                  </>
                ) : (
                  <>
                    Save Changes
                    <span>→</span>
                  </>
                )}
              </button>

            </div>

          </form>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <p className="mt-6 text-center text-[10px] text-black/20">
          BiblioDrop
        </p>

      </div>
    </main>
  );
}