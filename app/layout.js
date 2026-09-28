import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JwtSync from "@/components/JwtSync";

export const metadata = {
  title: "BiblioDrop",
  description: "Your Local Library, Delivered",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <JwtSync />

        <Navbar />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}