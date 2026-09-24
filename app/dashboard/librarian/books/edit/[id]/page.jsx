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

      alert(
        error.message || "Something went wrong"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffdf8] p-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-gray-500">
            Loading book...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdf8] px-4 py-8">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
            Manage Books
          </p>

          <h1 className="mt-1 text-3xl font-black text-black">
            Edit Book
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Update your book information.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-sm"
        >
          <div className="grid gap-5 md:grid-cols-2">

            {/* Title */}
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-700">
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            {/* Author */}
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-700">
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-700">
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            {/* Delivery Fee */}
            <div>
              <label className="mb-2 block text-xs font-bold text-gray-700">
                Delivery Fee
              </label>

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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            {/* Cover Image */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold text-gray-700">
                Cover Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    setSelectedFile(file);
                  }
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
              />

              {/* New selected image */}
              {selectedFile && (
                <p className="mt-2 text-xs font-medium text-gray-500">
                  New image selected: {selectedFile.name}
                </p>
              )}

              {/* Current Image */}
              {form.coverImage && !selectedFile && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-bold text-gray-500">
                    Current Image
                  </p>

                  <img
                    src={form.coverImage}
                    alt={form.title}
                    className="h-32 w-24 rounded-lg border border-gray-200 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold text-gray-700">
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={updating}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updating}
              className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updating ? "Updating..." : "Update Book"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}