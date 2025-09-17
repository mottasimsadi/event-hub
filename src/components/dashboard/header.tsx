"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { FaSearch, FaUserShield, FaUser } from "react-icons/fa";
import { User } from "@/lib/db";
import ThemeToggle from "@/components/ui/theme-toggle";
import { AuthContext } from "@/components/providers/AuthProvider";

interface HeaderProps {
  user: User;
}

export default function DashboardHeader({ user }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Handle search functionality
  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      // Search events
      const eventsResponse = await fetch(
        `/api/events/search?query=${encodeURIComponent(value)}`
      );
      const eventsData = await eventsResponse.json();

      // Search bookings
      const bookingsResponse = await fetch(
        `/api/bookings/search?query=${encodeURIComponent(value)}`
      );
      const bookingsData = await bookingsResponse.json();

      // Combine results
      const combinedResults = [
        ...(Array.isArray(eventsData)
          ? eventsData.map((event: any) => ({
              ...event,
              type: "event",
              url: `/dashboard/events/${event._id}`,
            }))
          : []),
        ...(Array.isArray(bookingsData)
          ? bookingsData.map((booking: any) => ({
              ...booking,
              type: "booking",
              url: `/dashboard/bookings/${booking._id}`,
            }))
          : []),
      ];

      setSearchResults(combinedResults.slice(0, 5)); // Limit to 5 results
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node) &&
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Search */}
          <div className="flex-1 min-w-0 md:ml-10 lg:ml-0">
            <div className="max-w-lg w-full lg:max-w-xs relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search events, bookings..."
                type="search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.length >= 2) {
                    handleSearch(e.target.value);
                  } else {
                    setSearchResults([]);
                  }
                }}
              />

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div
                  ref={searchResultsRef}
                  className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto"
                >
                  <div className="py-1">
                    {isSearching ? (
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        Searching...
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        No results found
                      </div>
                    ) : (
                      searchResults.map((result) => (
                        <a
                          key={`${result.type}-${result._id}`}
                          href={result.url}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setSearchResults([])}
                        >
                          <div className="flex items-center">
                            <span className="mr-2">
                              {result.type === "event" ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                                  Event
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                                  Booking
                                </span>
                              )}
                            </span>
                            <span className="font-medium">
                              {result.type === "event"
                                ? result.title
                                : `Booking for ${
                                    result.event?.title || "Unknown Event"
                                  }`}
                            </span>
                          </div>
                        </a>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Theme Toggle and Profile */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfile}
                className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
                </div>
              </button>

              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center mt-1">
                        {user.role === "admin" ? (
                          <>
                            <FaUserShield className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                            <span className="ml-1 text-xs font-medium text-blue-500 dark:text-blue-400">
                              Admin
                            </span>
                          </>
                        ) : (
                          <>
                            <FaUser className="h-3 w-3 text-green-500 dark:text-green-400" />
                            <span className="ml-1 text-xs font-medium text-green-500 dark:text-green-400">
                              User
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <a
                      href="/dashboard/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Profile
                    </a>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
