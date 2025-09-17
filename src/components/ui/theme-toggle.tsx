"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
      aria-label="Toggle theme"
    >
      <div className="relative h-5 w-5">
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all absolute top-0 left-0 dark:-rotate-90 dark:scale-0" />
        <Moon className="h-5 w-5 rotate-90 scale-0 transition-all absolute top-0 left-0 dark:rotate-0 dark:scale-100" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

export default ThemeToggle;
