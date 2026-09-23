"use client";

import { useState } from "react";

export default function AddBook() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    deliveryFee: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form);
    alert("Book added successfully!");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Add New Book</h1>
        <p className="mt-2 text-gray-600">
          Add a new book to your library inventory.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-xl bg-white p-6 shadow"
        >
          <div>
            <label className="mb-2 block font-medium">Book Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter book title"
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Author</label>
            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="Enter author name"
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border p-3"
              required
            >
              <option value="">Select category</option>
              <option value="Fiction">Fiction</option>
              <option value="Science">Science</option>
              <option value="Technology">Technology</option>
              <option value="History">History</option>
              <option value="Biography">Biography</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write book description"
              rows="5"
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Delivery Fee
            </label>
            <input
              type="number"
              name="deliveryFee"
              value={form.deliveryFee}
              onChange={handleChange}
              placeholder="Enter delivery fee"
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Add Book
          </button>
        </form>
      </div>
    </main>
  );
}