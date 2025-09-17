"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error("404 Error: Page not found →", pathname);
  }, [pathname]);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col justify-center items-center px-4 py-8">
      <div className="max-w-3xl">
        <svg
          className="w-64 h-64 mx-auto text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </div>

      <div className="text-center space-y-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          The page at
          <code className="px-2 py-1 rounded mx-1 bg-gray-100 dark:bg-gray-800 text-red-500">
            {pathname}
          </code>
          doesn&apos;t exist or has been moved.
        </p>

        <div className="pt-4">
          <Link href="/" aria-label="Return to home page">
            <button className="px-8 py-3 rounded-lg font-semibold text-lg shadow-md text-blue-600 border border-blue-600 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white">
              ← Return to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
