"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  function handleReset() {
    reset();
  }
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-lg w-full animate-fadeIn">
        <div className="flex justify-center mb-6">
          <svg
            className="w-20 h-20 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md mx-auto text-lg">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        <div className="mb-8 max-w-md mx-auto">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Error code:{" "}
            <span className="text-red-500 dark:text-red-400">
              {error.digest || "Unknown"}
            </span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Reason:{" "}
            <span className="text-red-500 dark:text-red-400">
              {error.message || "An unexpected error occurred"}
            </span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-medium"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 font-medium"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
