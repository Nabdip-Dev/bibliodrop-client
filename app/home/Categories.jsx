import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "Fiction",
    icon: "📖",
  },
  {
    id: 2,
    name: "Technology",
    icon: "💻",
  },
  {
    id: 3,
    name: "Self Help",
    icon: "🌱",
  },
  {
    id: 4,
    name: "History",
    icon: "🏛️",
  },
  {
    id: 5,
    name: "Science",
    icon: "🔬",
  },
  {
    id: 6,
    name: "Finance",
    icon: "💰",
  },
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold">
          Browse by Category
        </h2>

        <p className="mt-2 text-gray-600">
          Find books based on your interests.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/browse-books?category=${encodeURIComponent(
              category.name
            )}`}
            className="rounded-xl border bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-4xl">
              {category.icon}
            </div>

            <h3 className="mt-3 font-semibold">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}