export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          
          <div>
            <h2 className="text-xl font-bold">
              BiblioDrop
            </h2>

            <p className="mt-2 max-w-sm text-sm text-gray-600">
              Your Local Library, Delivered.
            </p>
          </div>

          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:opacity-70">
              About
            </a>

            <a href="#" className="hover:opacity-70">
              Contact
            </a>

            <a href="#" className="hover:opacity-70">
              Privacy Policy
            </a>
          </div>

        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-gray-500">
          © 2026 BiblioDrop. All rights reserved.
        </div>

      </div>
    </footer>
  );
}