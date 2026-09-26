"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function EditBook() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    deliveryFee: "",
    coverImage: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/books/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch book");
        }

        const data = await response.json();

        setForm({
          title: data.title || "",
          author: data.author || "",
          category: data.category || "",
          description: data.description || "",
          deliveryFee: data.deliveryFee || "",
          coverImage: data.coverImage || "",
        });
      } catch (error) {
        console.error("FETCH BOOK ERROR:", error);
        alert("Failed to load book");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      const { data: session } = await authClient.getSession();

      if (!session?.user) {
        throw new Error("You must be logged in.");
      }

      let imageUrl = form.coverImage;

      // Upload new image if selected
      if (selectedFile) {
        const imageFormData = new FormData();

        imageFormData.append("image", selectedFile);

        const uploadResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          {
            method: "POST",
            body: imageFormData,
          }
        );

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadData.success) {
          throw new Error("Image upload failed");
        }

        imageUrl = uploadData.data.url;
      }

      // Update book
      const response = await fetch(
        `http://localhost:5000/books/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: form.title,
            author: form.author,
            category: form.category,
            description: form.description,
            deliveryFee: form.deliveryFee,
            coverImage: imageUrl,
            librarianId: session.user.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update book"
        );
      }

      alert("Book updated successfully!");

      router.push("/dashboard/librarian/books");
    } catch (error) {
      console.error("UPDATE BOOK ERROR:", error);

      alert(error.message || "Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  // ================================
  // Loading
  // ================================
  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffdf8] px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="mb-5 h-4 w-28 rounded bg-gray-200" />
          <div className="mb-2 h-9 w-40 rounded-lg bg-gray-200" />
          <div className="mb-6 h-4 w-56 rounded bg-gray-200" />

          <div className="rounded-[22px] border border-black/[0.05] bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-11 rounded-xl bg-gray-100" />
              <div className="h-11 rounded-xl bg-gray-100" />
              <div className="h-11 rounded-xl bg-gray-100" />
              <div className="h-11 rounded-xl bg-gray-100" />
              <div className="h-32 rounded-xl bg-gray-100 md:col-span-2" />
              <div className="h-28 rounded-xl bg-gray-100 md:col-span-2" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffdf8] px-4 py-6 sm:px-6">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-24 top-20 h-56 w-56 rounded-full bg-[#fc1d15]/[0.035] blur-3xl" />

      <div className="pointer-events-none absolute -right-24 top-32 h-64 w-64 rounded-full bg-[#fcc615]/[0.07] blur-3xl" />

      <div className="relative mx-auto max-w-4xl">
        {/* ================= Header ================= */}
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#fc1d15]" />

              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                Manage Books
              </p>
            </div>

            <h1 className="mt-1.5 text-2xl font-black tracking-tight text-black sm:text-3xl">
              Edit Book
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Update your book information.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            disabled={updating}
            className="hidden items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-3.5 py-2 text-xs font-bold text-gray-600 shadow-sm transition-all duration-300 hover:-translate-x-0.5 hover:border-black/15 hover:text-black disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>

            Back
          </button>
        </div>

        {/* ================= Form Card ================= */}
        <form
          onSubmit={handleSubmit}
          className="rounded-[22px] border border-black/[0.06] bg-white p-4 shadow-[0_15px_50px_rgba(0,0,0,.055)] transition-shadow duration-500 hover:shadow-[0_18px_55px_rgba(0,0,0,.07)] sm:p-5"
        >
          {/* Form heading */}
          <div className="mb-5 flex items-center justify-between border-b border-black/[0.06] pb-4">
            <div>
              <h2 className="text-sm font-black text-black">
                Book Information
              </h2>

              <p className="mt-0.5 text-[10px] text-gray-400">
                Keep the information accurate and up to date.
              </p>
            </div>

            <span className="rounded-full bg-[#fcc615]/15 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-black">
              Editing
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* ================= Title ================= */}
            <div className="group">
              <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wide text-gray-500">
                Book Title
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                required
                placeholder="Enter book title"
                className="w-full rounded-xl border border-black/[0.09] bg-[#fcfcfc] px-3.5 py-2.75 text-xs font-medium text-black outline-none transition-all duration-300 placeholder:text-gray-300 focus:border-[#fc1d15]/50 focus:bg-white focus:ring-4 focus:ring-[#fc1d15]/[0.06]"
              />
            </div>

            {/* ================= Author ================= */}
            <div className="group">
              <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wide text-gray-500">
                Author
              </label>

              <input
                type="text"
                value={form.author}
                onChange={(e) =>
                  setForm({
                    ...form,
                    author: e.target.value,
                  })
                }
                required
                placeholder="Enter author name"
                className="w-full rounded-xl border border-black/[0.09] bg-[#fcfcfc] px-3.5 py-2.75 text-xs font-medium text-black outline-none transition-all duration-300 placeholder:text-gray-300 focus:border-[#fc1d15]/50 focus:bg-white focus:ring-4 focus:ring-[#fc1d15]/[0.06]"
              />
            </div>

            {/* ================= Category ================= */}
            <div className="group">
              <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wide text-gray-500">
                Category
              </label>

              <input
                type="text"
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
                required
                placeholder="e.g. Fiction"
                className="w-full rounded-xl border border-black/[0.09] bg-[#fcfcfc] px-3.5 py-2.75 text-xs font-medium text-black outline-none transition-all duration-300 placeholder:text-gray-300 focus:border-[#fc1d15]/50 focus:bg-white focus:ring-4 focus:ring-[#fc1d15]/[0.06]"
              />
            </div>

            {/* ================= Delivery Fee ================= */}
            <div className="group">
              <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wide text-gray-500">
                Delivery Fee
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={form.deliveryFee}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      deliveryFee: e.target.value,
                    })
                  }
                  required
                  placeholder="0"
                  className="w-full rounded-xl border border-black/[0.09] bg-[#fcfcfc] py-2.75 pl-8 pr-3.5 text-xs font-medium text-black outline-none transition-all duration-300 placeholder:text-gray-300 focus:border-[#fc1d15]/50 focus:bg-white focus:ring-4 focus:ring-[#fc1d15]/[0.06]"
                />
              </div>
            </div>

            {/* ================= Cover Image ================= */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wide text-gray-500">
                Cover Image
              </label>

              <div className="rounded-xl border border-dashed border-black/[0.12] bg-[#fcfcfc] p-3 transition-all duration-300 hover:border-[#fc1d15]/30 hover:bg-white">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-black px-3.5 py-2.5 text-[10px] font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fc1d15]">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 16V4" />
                      <path d="m7 9 5-5 5 5" />
                      <path d="M5 20h14" />
                    </svg>

                    Choose New Image

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];

                        if (file) {
                          setSelectedFile(file);
                        }
                      }}
                    />
                  </label>

                  <div className="min-w-0">
                    {selectedFile ? (
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />

                        <p className="truncate text-[10px] font-semibold text-gray-600">
                          {selectedFile.name}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[10px] text-gray-400">
                        Select an image to replace the current cover.
                      </p>
                    )}
                  </div>
                </div>

                {/* Current / Selected Preview */}
                <div className="mt-3 flex gap-3">
                  {/* Current image */}
                  {form.coverImage && !selectedFile && (
                    <div className="animate-[fadeIn_.3s_ease-out]">
                      <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-gray-400">
                        Current
                      </p>

                      <div className="group relative h-28 w-20 overflow-hidden rounded-xl border border-black/[0.07] bg-white shadow-sm">
                        <img
                          src={form.coverImage}
                          alt={form.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  )}

                  {/* New selected image */}
                  {selectedFile && (
                    <div className="animate-[fadeIn_.3s_ease-out]">
                      <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-[#fc1d15]">
                        New Preview
                      </p>

                      <div className="group relative h-28 w-20 overflow-hidden rounded-xl border border-[#fc1d15]/20 bg-white shadow-sm">
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="New cover preview"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/10" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ================= Description ================= */}
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wide text-gray-500">
                Description
              </label>

              <textarea
                rows={5}
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                required
                placeholder="Write a short description about the book..."
                className="w-full resize-none rounded-xl border border-black/[0.09] bg-[#fcfcfc] px-3.5 py-3 text-xs font-medium leading-5 text-black outline-none transition-all duration-300 placeholder:text-gray-300 focus:border-[#fc1d15]/50 focus:bg-white focus:ring-4 focus:ring-[#fc1d15]/[0.06]"
              />
            </div>
          </div>

          {/* ================= Buttons ================= */}
          <div className="mt-5 flex flex-col-reverse gap-2.5 border-t border-black/[0.06] pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={updating}
              className="rounded-xl border border-black/[0.09] bg-white px-5 py-2.75 text-xs font-black text-gray-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-50 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updating}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#fc1d15] px-5 py-2.75 text-xs font-black text-white shadow-[4px_4px_0_#fcc615] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#fcc615] active:translate-y-0 active:shadow-[2px_2px_0_#fcc615] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {updating ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Updating...
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>

                  Update Book
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
