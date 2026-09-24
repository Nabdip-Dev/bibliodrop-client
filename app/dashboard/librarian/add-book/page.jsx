"use client";

import { useEffect, useState } from "react";
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setToast("Please select a valid image file.");
      return;
    }

    setSelectedFile(file);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    setForm((prev) => ({
      ...prev,
      coverImage: "",
    }));
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      ...form,
      coverImage: form.coverImage || previewUrl,
    };

    console.log("BOOK DATA:", submitData);
    console.log("SELECTED FILE:", selectedFile);

    setToast("Book added successfully!");

    setForm({
      title: "",
      author: "",
      category: "",
      description: "",
      deliveryFee: "",
      coverImage: "",
    });

    setSelectedFile(null);
    setPreviewUrl("");
  };

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    return () => {
      if (previewUrl && selectedFile) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, selectedFile]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fffdf8] px-4 py-6 sm:px-6">
      {/* Background */}
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-[#fc1d15]/[0.05] blur-3xl" />

      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#fcc615]/[0.10] blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-[#fc1d15]/[0.025] blur-3xl" />

      <div className="relative mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-8 rounded-full bg-[#fc1d15]" />

              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#fc1d15]">
                Library Inventory
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
              Add New <span className="text-[#fc1d15]">Book</span>
            </h1>

            <p className="mt-1.5 text-sm text-gray-500">
              Add a new book to your library collection.
            </p>
          </div>

          <Link
            href="/dashboard/librarian"
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#fc1d15]/30 hover:text-[#fc1d15] hover:shadow-md"
          >
            <FiArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Dashboard
          </Link>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-[24px] border border-black/[0.07] bg-white shadow-[0_15px_50px_rgba(0,0,0,0.06)]"
        >
          {/* Accent */}
          <div className="h-1 w-full bg-gradient-to-r from-[#fc1d15] via-[#fc1d15] to-[#fcc615]" />

          {/* Form Header */}
          <div className="border-b border-black/[0.06] px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fc1d15] text-white shadow-[4px_4px_0_#fcc615]">
                <FiBookOpen className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-base font-black text-black">
                  Book Information
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  Fill in the details below.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 px-5 py-6 sm:px-7">
            {/* Title + Author */}
            <div className="grid gap-5 md:grid-cols-2">
              {/* Title */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-black text-gray-800">
                  <FiBookOpen className="h-3.5 w-3.5 text-[#fc1d15]" />
                  Book Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter book title"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-[#fffdf9] px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-[#fc1d15]/40 focus:bg-white focus:ring-4 focus:ring-[#fc1d15]/[0.07]"
                />
              </div>

              {/* Author */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-black text-gray-800">
                  <FiUser className="h-3.5 w-3.5 text-[#fc1d15]" />
                  Author
                </label>

                <input
                  type="text"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="Enter author name"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-[#fffdf9] px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-[#fc1d15]/40 focus:bg-white focus:ring-4 focus:ring-[#fc1d15]/[0.07]"
                />
              </div>
            </div>

            {/* Category + Delivery */}
            <div className="grid gap-5 md:grid-cols-2">
              {/* Category */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-black text-gray-800">
                  <FiTag className="h-3.5 w-3.5 text-[#fc1d15]" />
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full cursor-pointer rounded-xl border border-gray-200 bg-[#fffdf9] px-4 py-3 text-sm font-medium text-gray-700 outline-none transition-all duration-300 focus:border-[#fc1d15]/40 focus:bg-white focus:ring-4 focus:ring-[#fc1d15]/[0.07]"
                >
                  <option value="">Select category</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Science">Science</option>
                  <option value="Technology">Technology</option>
                  <option value="History">History</option>
                  <option value="Biography">Biography</option>
                </select>
              </div>

              {/* Delivery */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-black text-gray-800">
                  <FiTruck className="h-3.5 w-3.5 text-[#fc1d15]" />
                  Delivery Fee
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-[#fc1d15]">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="deliveryFee"
                    value={form.deliveryFee}
                    onChange={handleChange}
                    placeholder="Enter delivery fee"
                    min="0"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-[#fffdf9] py-3 pl-9 pr-4 text-sm font-medium text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-[#fc1d15]/40 focus:bg-white focus:ring-4 focus:ring-[#fc1d15]/[0.07]"
                  />
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-black text-gray-800">
                <FiImage className="h-3.5 w-3.5 text-[#fc1d15]" />
                Book Cover
              </label>

              {/* Tabs */}
              <div className="mb-3 flex rounded-xl bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setImageMode("upload")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition-all duration-300 ${
                    imageMode === "upload"
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  <FiUploadCloud className="h-4 w-4" />
                  Upload Image
                </button>

                <button
                  type="button"
                  onClick={() => setImageMode("link")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition-all duration-300 ${
                    imageMode === "link"
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  <FiLink className="h-4 w-4" />
                  Image URL
                </button>
              </div>

              {imageMode === "upload" ? (
                <label className="group block cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-[#fffdf9] px-5 py-8 text-center transition-all duration-300 hover:border-[#fc1d15]/40 hover:bg-[#fffaf7]">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {previewUrl && selectedFile ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={previewUrl}
                          alt="Book cover preview"
                          className="h-44 w-32 rounded-xl object-cover shadow-lg transition-transform duration-500 group-hover:scale-[1.03]"
                        />

                        <p className="mt-3 text-xs font-bold text-gray-700">
                          {selectedFile.name}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                          Click to replace image
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fc1d15]/10 text-[#fc1d15] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#fc1d15] group-hover:text-white">
                          <FiUploadCloud className="h-6 w-6" />
                        </div>

                        <p className="mt-4 text-sm font-black text-gray-800">
                          Upload book cover
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          PNG, JPG or WEBP
                        </p>
                      </>
                    )}
                  </div>
                </label>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <FiLink className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#fc1d15]" />

                    <input
                      type="url"
                      name="coverImage"
                      value={form.coverImage}
                      onChange={handleChange}
                      placeholder="https://example.com/book-cover.jpg"
                      className="w-full rounded-xl border border-gray-200 bg-[#fffdf9] py-3 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-[#fc1d15]/40 focus:bg-white focus:ring-4 focus:ring-[#fc1d15]/[0.07]"
                    />
                  </div>

                  {previewUrl && !selectedFile && (
                    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-[#fffdf9] p-3">
                      <img
                        src={previewUrl}
                        alt="Book cover preview"
                        className="h-24 w-16 rounded-lg object-cover shadow-md"
                        onError={() => setPreviewUrl("")}
                      />

                      <div>
                        <p className="text-xs font-black text-gray-800">
                          Image Preview
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                          Your cover image will be used from this URL.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Remove */}
              {previewUrl && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-gray-400 transition-colors hover:text-[#fc1d15]"
                >
                  <FiTrash2 className="h-3.5 w-3.5" />
                  Remove image
                </button>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-black text-gray-800">
                <FiFileText className="h-3.5 w-3.5 text-[#fc1d15]" />
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write a short description about this book..."
                rows={5}
                required
                className="w-full resize-none rounded-xl border border-gray-200 bg-[#fffdf9] px-4 py-3 text-sm font-medium leading-6 text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-[#fc1d15]/40 focus:bg-white focus:ring-4 focus:ring-[#fc1d15]/[0.07]"
              />

              <div className="mt-1.5 flex justify-end">
                <span className="text-[10px] font-medium text-gray-400">
                  {form.description.length} characters
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="border-t border-black/[0.06] pt-5">
              <button
                type="submit"
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-black px-5 py-3.5 text-sm font-black text-white shadow-[4px_4px_0_#fcc615] transition-all duration-300 hover:-translate-y-1 hover:bg-[#fc1d15] hover:shadow-[5px_5px_0_#fcc615] active:translate-y-0 active:shadow-[2px_2px_0_#fcc615]"
              >
                <FiPlus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />

                Add Book

                <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-700 group-hover:translate-x-full" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-32px)] max-w-sm -translate-x-1/2 animate-[addBookToast_.3s_ease-out]">
          <div className="flex items-center gap-3 rounded-2xl bg-black px-4 py-3.5 text-white shadow-[0_15px_45px_rgba(0,0,0,0.22)]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#fcc615] text-black">
              <FiCheckCircle className="h-4 w-4" />
            </div>

            <p className="text-xs font-bold">{toast}</p>

            <button
              type="button"
              onClick={() => setToast("")}
              className="ml-auto text-gray-400 transition-colors hover:text-white"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}