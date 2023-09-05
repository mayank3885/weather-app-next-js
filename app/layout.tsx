import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weather Forecast",
  description: "Weather app created using Next js.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-sky-400 header">
          <Link href="/">Weather</Link>
          <ul>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </div>
        <main className="main">{children}</main>
        <span className="toast-container">
          <ToastContainer position="top-center" />
        </span>
        <footer>
          Created by &nbsp;<Link href="/about">Mayank</Link>
        </footer>
      </body>
    </html>
  );
}
