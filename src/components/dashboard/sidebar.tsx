"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthContext } from '@/components/providers/AuthProvider';
import {
  FaCalendarAlt,
  FaChartBar,
  FaUsers,
  FaSignOutAlt,
  FaUserCircle,
  FaUserShield,
  FaUser,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { BiMenu } from "react-icons/bi";
import { toast } from "sonner";
import { User } from "@/lib/db";

interface SidebarProps {
  user: User;
}

export default function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  function toggleMobileMenu() {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  const isActive = (path: string) => {
    if (path === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === path || pathname.startsWith(`${path}/`);
  };

  const { logout } = useContext(AuthContext);
  
  const handleLogout = () => {
    logout();
  };

  const userNavItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <MdDashboard className="w-5 h-5" />,
    },
    {
      name: "My Events",
      href: "/dashboard/events",
      icon: <FaCalendarAlt className="w-5 h-5" />,
    },
    {
      name: "My Bookings",
      href: "/dashboard/bookings",
      icon: <FaUsers className="w-5 h-5" />,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: <FaUserCircle className="w-5 h-5" />,
    },
  ];

  const adminNavItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <MdDashboard className="w-5 h-5" />,
    },
    {
      name: "Manage Users",
      href: "/dashboard/manage-users",
      icon: <FaUser className="w-5 h-5" />,
    },
    {
      name: "Manage Events",
      href: "/dashboard/manage-events",
      icon: <FaCalendarAlt className="w-5 h-5" />,
    },
    {
      name: "Manage Bookings",
      href: "/dashboard/manage-bookings",
      icon: <FaUsers className="w-5 h-5" />,
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: <FaChartBar className="w-5 h-5" />,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: <FaUserCircle className="w-5 h-5" />,
    },
  ];

  const navItems = user?.role === "admin" ? adminNavItems : userNavItems;

  return (
    <>
      {/* Mobile Menu */}
      <div className="lg:hidden fixed top-3 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className={`p-2 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transition-transform duration-200 ease-in-out transform hover:scale-105 ${
            isMobileMenuOpen ? "hidden" : "block"
          }`}
          aria-label="Toggle sidebar"
        >
          <BiMenu className="w-6 h-6" />
        </button>
      </div>


      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } lg:hidden transition-opacity duration-300 ease-in-out`}
        onClick={closeMobileMenu}
      ></div>


      <div
        className={`fixed inset-y-0 left-0 z-40 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden transition-transform duration-300 ease-in-out`}
      >
        <div className="relative flex flex-col w-64 h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <Link href="/" className="text-xl font-bold flex items-center">
              <div className="mr-2 text-blue-600 dark:text-blue-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8"
                >
                  <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                  <path
                    fillRule="evenodd"
                    d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>Event Hub</span>
            </Link>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Close sidebar"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
          <div className="flex flex-col flex-grow p-4 overflow-y-auto">
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive(item.href)
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  onClick={closeMobileMenu}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>
            <div className="pt-4 mt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{user?.name || 'User'}</p>
                  <p className="text-sm text-gray-400">{user?.email || 'Loading...'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSignOutAlt className="w-5 h-5" />
                <span className="ml-3">
                  {isLoggingOut ? "Signing out..." : "Logout"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white z-30 shadow-xl">
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="text-xl font-bold flex items-center">
            <div className="mr-2 text-blue-600 dark:text-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8"
              >
                <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                <path
                  fillRule="evenodd"
                  d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span>Event Hub</span>
          </Link>
        </div>
        <div className="flex flex-col flex-grow p-4 overflow-y-auto">
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive(item.href)
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </nav>
          <div className="pt-4 mt-6 border-t border-gray-700">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="ml-3">
                <p className="font-medium">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-400">{user?.email || 'Loading...'}</p>
                <div className="flex items-center mt-1">
                  {user?.role === "admin" ? (
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
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span className="ml-3">
                {isLoggingOut ? "Signing out..." : "Logout"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
