"use client";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-800 border-t-4 border-t-blue-600 dark:border-t-blue-400"></div>
        <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg font-medium">
          Loading...
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Please wait while we prepare your content
        </p>
        <div className="mt-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
          <div className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
