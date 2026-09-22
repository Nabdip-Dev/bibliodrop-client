export default function Home() {
  return (
    <div className="min-h-screen">
      
      <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-6">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest">
            Welcome to BiblioDrop
          </p>

          <h1 className="max-w-3xl text-5xl font-bold leading-tight md:text-7xl">
            Your Local Library, Delivered.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-gray-600">
            Discover books from local libraries and independent book owners
            and get them delivered to your doorstep.
          </p>

          <div className="mt-8">
            <a
              href="/browse-books"
              className="inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white"
            >
              Browse Books
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}