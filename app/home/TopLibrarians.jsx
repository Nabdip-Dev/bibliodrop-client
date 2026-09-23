const librarians = [
  {
    id: 1,
    name: "Rahim Ahmed",
    books: 120,
  },
  {
    id: 2,
    name: "Karim Hasan",
    books: 95,
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    books: 82,
  },
];

export default function TopLibrarians() {
  return (
    <section className="bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">

        <div className="text-center">
          <h2 className="text-3xl font-bold">
            Top Librarians
          </h2>

          <p className="mt-2 text-gray-600">
            Meet some of our trusted library partners.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {librarians.map((librarian) => (
            <div
              key={librarian.id}
              className="rounded-xl bg-white p-6 text-center shadow-sm"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-3xl">
                👤
              </div>

              <h3 className="mt-4 text-xl font-bold">
                {librarian.name}
              </h3>

              <p className="mt-2 text-gray-600">
                {librarian.books}+ books available
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}