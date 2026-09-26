"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

import {
  FiBookOpen,
  FiUser,
  FiTag,
  FiFileText,
  FiTruck,
  FiPlus,
  FiCheckCircle,
  FiX,
  FiArrowLeft,
  FiUploadCloud,
  FiLink,
  FiImage,
  FiTrash2,
} from "react-icons/fi";

export default function AddBook() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    deliveryFee: "",
    coverImage: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageMode, setImageMode] = useState("upload");
  const [toast, setToast] = useState("");

  // =========================================================
  // FORM CHANGE
  // =========================================================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "coverImage") {
      setPreviewUrl(e.target.value);
      setSelectedFile(null);
    }
  };

  // =========================================================
  // FILE CHANGE
  // =========================================================
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setToast("Please select a valid image file.");
      return;
    }

    if (previewUrl && selectedFile) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);

    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl(objectUrl);

    setForm((prev) => ({
      ...prev,
      coverImage: "",
    }));
  };

  // =========================================================
  // REMOVE IMAGE
  // =========================================================
  const removeImage = () => {
    if (previewUrl && selectedFile) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl("");

    setForm((prev) => ({
      ...prev,
      coverImage: "",
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = form.coverImage;

      // Upload selected image to ImgBB
      if (selectedFile) {
        const imageFormData = new FormData();

        imageFormData.append(
          "image",
          selectedFile
        );

        const uploadResponse = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          {
            method: "POST",
            body: imageFormData,
          }
        );

        const uploadData =
          await uploadResponse.json();

        if (
          !uploadResponse.ok ||
          !uploadData.success
        ) {
          throw new Error(
            "Image upload failed"
          );
        }

        imageUrl = uploadData.data.url;
      }

      // Get current user
      const { data: session } =
        await authClient.getSession();

      if (!session?.user) {
        throw new Error(
          "You must be logged in."
        );
      }

      const submitData = {
        ...form,
        coverImage: imageUrl,
        librarianId: session.user.id,
      };

      const response = await fetch(
        "http://localhost:5000/books",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            submitData
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add book"
        );
      }

      setToast(
        "Book added successfully!"
      );

      // Reset form
      setForm({
        title: "",
        author: "",
        category: "",
        description: "",
        deliveryFee: "",
        coverImage: "",
      });

      if (previewUrl && selectedFile) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(null);
      setPreviewUrl("");
      setImageMode("upload");
    } catch (error) {
      console.error(
        "ADD BOOK ERROR:",
        error
      );

      setToast(
        error.message ||
          "Failed to add book"
      );
    }
  };

  // =========================================================
  // TOAST
  // =========================================================
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [toast]);

  // =========================================================
  // CLEANUP
  // =========================================================
  useEffect(() => {
    return () => {
      if (previewUrl && selectedFile) {
        URL.revokeObjectURL(
          previewUrl
        );
      }
    };
  }, [previewUrl, selectedFile]);

  return (
    <main className="relative min-h-full bg-[#fafaf8] px-3 py-4 sm:px-5 lg:px-6">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}
      <div className="pointer-events-none absolute left-0 top-0 h-48 w-48 rounded-full bg-red-500/[0.025] blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-yellow-400/[0.035] blur-3xl" />

      <div className="relative mx-auto max-w-5xl">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <section className="mb-4 flex items-center justify-between gap-4">

          <div className="min-w-0">

            <div className="mb-1 flex items-center gap-1.5">
              <span className="h-1 w-5 rounded-full bg-[#fc1d15]" />

              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#fc1d15]">
                Library Inventory
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-black sm:text-3xl">
              Add New{" "}
              <span className="text-[#fc1d15]">
                Book
              </span>
            </h1>

            <p className="mt-1 text-[10px] text-gray-400">
              Add a new book to your library collection.
            </p>

          </div>

          <Link
            href="/dashboard/librarian"
            className="group flex shrink-0 items-center gap-1.5 rounded-lg border border-black/[0.06] bg-white px-3 py-2 text-[9px] font-black text-gray-500 transition-all hover:border-[#fc1d15]/20 hover:bg-[#fc1d15] hover:text-white"
          >
            <FiArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />

            <span className="hidden sm:inline">
              Dashboard
            </span>
          </Link>

        </section>

        {/* =====================================================
            FORM CARD
        ====================================================== */}
        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.035)]"
        >

          {/* Top accent */}
          <div className="h-[2px] w-full bg-gradient-to-r from-[#fc1d15] via-[#fc1d15] to-[#fcc615]" />

          {/* =================================================
              FORM HEADER
          ================================================== */}
          <div className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-3.5 sm:px-5">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fc1d15] text-white shadow-[3px_3px_0_#fcc615]">
              <FiBookOpen className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-black text-black">
                Book Information
              </h2>

              <p className="mt-0.5 text-[8px] text-gray-400">
                Fill in the details below.
              </p>
            </div>

          </div>

          {/* =================================================
              FORM CONTENT
          ================================================== */}
          <div className="space-y-3.5 p-4 sm:p-5">

            {/* =================================================
                TITLE + AUTHOR
            ================================================== */}
            <div className="grid gap-3 sm:grid-cols-2">

              {/* TITLE */}
              <div>

                <label className="mb-1.5 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wide text-gray-600">
                  <FiBookOpen className="h-3 w-3 text-[#fc1d15]" />
                  Book Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter book title"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-[#fafaf8] px-3 py-2.5 text-[10px] font-medium text-gray-800 outline-none transition focus:border-[#fc1d15]/30 focus:bg-white focus:ring-2 focus:ring-[#fc1d15]/[0.04]"
                />

              </div>

              {/* AUTHOR */}
              <div>

                <label className="mb-1.5 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wide text-gray-600">
                  <FiUser className="h-3 w-3 text-[#fc1d15]" />
                  Author
                </label>

                <input
                  type="text"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="Enter author name"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-[#fafaf8] px-3 py-2.5 text-[10px] font-medium text-gray-800 outline-none transition focus:border-[#fc1d15]/30 focus:bg-white focus:ring-2 focus:ring-[#fc1d15]/[0.04]"
                />

              </div>

            </div>

            {/* =================================================
                CATEGORY + DELIVERY
            ================================================== */}
            <div className="grid gap-3 sm:grid-cols-2">

              {/* CATEGORY */}
              <div>

                <label className="mb-1.5 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wide text-gray-600">
                  <FiTag className="h-3 w-3 text-[#fc1d15]" />
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full cursor-pointer rounded-lg border border-gray-200 bg-[#fafaf8] px-3 py-2.5 text-[10px] font-medium text-gray-700 outline-none transition focus:border-[#fc1d15]/30 focus:bg-white focus:ring-2 focus:ring-[#fc1d15]/[0.04]"
                >
                  <option value="">
                    Select category
                  </option>

                  <option value="Fiction">
                    Fiction
                  </option>

                  <option value="Science">
                    Science
                  </option>

                  <option value="Technology">
                    Technology
                  </option>

                  <option value="History">
                    History
                  </option>

                  <option value="Biography">
                    Biography
                  </option>
                </select>

              </div>

              {/* DELIVERY */}
              <div>

                <label className="mb-1.5 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wide text-gray-600">
                  <FiTruck className="h-3 w-3 text-[#fc1d15]" />
                  Delivery Fee
                </label>

                <div className="relative">

                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#fc1d15]">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="deliveryFee"
                    value={
                      form.deliveryFee
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter delivery fee"
                    min="0"
                    required
                    className="w-full rounded-lg border border-gray-200 bg-[#fafaf8] py-2.5 pl-7 pr-3 text-[10px] font-medium text-gray-800 outline-none transition focus:border-[#fc1d15]/30 focus:bg-white focus:ring-2 focus:ring-[#fc1d15]/[0.04]"
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                COVER IMAGE
            ================================================== */}
            <div>

              <label className="mb-1.5 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wide text-gray-600">
                <FiImage className="h-3 w-3 text-[#fc1d15]" />
                Book Cover
              </label>

              {/* MODE SWITCH */}
              <div className="mb-2 flex rounded-lg bg-[#f5f5f3] p-1">

                <button
                  type="button"
                  onClick={() =>
                    setImageMode("upload")
                  }
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-[8px] font-black transition ${
                    imageMode ===
                    "upload"
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-400 hover:text-black"
                  }`}
                >
                  <FiUploadCloud className="h-3 w-3" />
                  Upload Image
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setImageMode("link")
                  }
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-[8px] font-black transition ${
                    imageMode === "link"
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-400 hover:text-black"
                  }`}
                >
                  <FiLink className="h-3 w-3" />
                  Image URL
                </button>

              </div>

              {/* UPLOAD MODE */}
              {imageMode ===
              "upload" ? (

                <label className="group block cursor-pointer">

                  <div className="relative overflow-hidden rounded-xl border border-dashed border-gray-200 bg-[#fafaf8] px-4 py-5 text-center transition hover:border-[#fc1d15]/30 hover:bg-[#fffaf8]">

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={
                        handleFileChange
                      }
                      className="hidden"
                    />

                    {previewUrl &&
                    selectedFile ? (

                      <div className="flex items-center justify-center gap-3">

                        <img
                          src={
                            previewUrl
                          }
                          alt="Book cover preview"
                          className="h-24 w-[68px] rounded-lg object-cover shadow-md"
                        />

                        <div className="text-left">

                          <p className="max-w-[200px] truncate text-[9px] font-black text-gray-700">
                            {selectedFile.name}
                          </p>

                          <p className="mt-1 text-[8px] text-gray-400">
                            Click to replace image
                          </p>

                        </div>

                      </div>

                    ) : (

                      <>

                        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#fc1d15]/[0.08] text-[#fc1d15] transition group-hover:bg-[#fc1d15] group-hover:text-white">
                          <FiUploadCloud className="h-4 w-4" />
                        </div>

                        <p className="mt-2 text-[10px] font-black text-gray-700">
                          Upload book cover
                        </p>

                        <p className="mt-0.5 text-[8px] text-gray-400">
                          PNG, JPG or WEBP
                        </p>

                      </>

                    )}

                  </div>

                </label>

              ) : (

                /* URL MODE */
                <div className="space-y-2">

                  <div className="relative">

                    <FiLink className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#fc1d15]" />

                    <input
                      type="url"
                      name="coverImage"
                      value={
                        form.coverImage
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="https://example.com/book-cover.jpg"
                      className="w-full rounded-lg border border-gray-200 bg-[#fafaf8] py-2.5 pl-9 pr-3 text-[10px] font-medium text-gray-800 outline-none transition focus:border-[#fc1d15]/30 focus:bg-white focus:ring-2 focus:ring-[#fc1d15]/[0.04]"
                    />

                  </div>

                  {previewUrl &&
                    !selectedFile && (

                      <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-[#fafaf8] p-2.5">

                        <img
                          src={
                            previewUrl
                          }
                          alt="Book cover preview"
                          className="h-16 w-11 rounded-md object-cover"
                          onError={() =>
                            setPreviewUrl(
                              ""
                            )
                          }
                        />

                        <div>

                          <p className="text-[9px] font-black text-gray-700">
                            Image Preview
                          </p>

                          <p className="mt-0.5 max-w-xs text-[8px] leading-4 text-gray-400">
                            Cover image preview from URL.
                          </p>

                        </div>

                      </div>

                    )}

                </div>

              )}

              {/* REMOVE IMAGE */}
              {previewUrl && (
                <button
                  type="button"
                  onClick={
                    removeImage
                  }
                  className="mt-1.5 inline-flex items-center gap-1 text-[8px] font-black text-gray-400 transition hover:text-[#fc1d15]"
                >
                  <FiTrash2 className="h-3 w-3" />
                  Remove image
                </button>
              )}

            </div>

            {/* =================================================
                DESCRIPTION
            ================================================== */}
            <div>

              <label className="mb-1.5 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wide text-gray-600">
                <FiFileText className="h-3 w-3 text-[#fc1d15]" />
                Description
              </label>

              <textarea
                name="description"
                value={
                  form.description
                }
                onChange={
                  handleChange
                }
                placeholder="Write a short description about this book..."
                rows={3}
                required
                className="w-full resize-none rounded-lg border border-gray-200 bg-[#fafaf8] px-3 py-2.5 text-[10px] font-medium leading-5 text-gray-800 outline-none transition focus:border-[#fc1d15]/30 focus:bg-white focus:ring-2 focus:ring-[#fc1d15]/[0.04]"
              />

              <div className="mt-1 flex justify-end">

                <span className="text-[7px] font-medium text-gray-300">
                  {form.description.length} characters
                </span>

              </div>

            </div>

            {/* =================================================
                SUBMIT
            ================================================== */}
            <div className="border-t border-black/[0.05] pt-3">

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-1.5 rounded-xl bg-black px-4 py-3 text-[10px] font-black text-white shadow-[3px_3px_0_#fcc615] transition-all duration-200 hover:bg-[#fc1d15] hover:shadow-[2px_2px_0_#fcc615] active:translate-y-0.5"
              >
                <FiPlus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />

                Add Book
              </button>

            </div>

          </div>
        </form>

      </div>

      {/* =====================================================
          TOAST
      ====================================================== */}
      {toast && (

        <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-xs -translate-x-1/2">

          <div className="flex items-center gap-2.5 rounded-xl bg-black px-3 py-2.5 text-white shadow-2xl">

            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fcc615] text-black">
              <FiCheckCircle className="h-3.5 w-3.5" />
            </div>

            <p className="min-w-0 flex-1 text-[9px] font-bold">
              {toast}
            </p>

            <button
              type="button"
              onClick={() =>
                setToast("")
              }
              className="text-gray-400 transition hover:text-white"
            >
              <FiX className="h-3 w-3" />
            </button>

          </div>

        </div>

      )}

    </main>
  );
}
