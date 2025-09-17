"use client";

import DashboardSidebar from "@/components/dashboard/sidebar";
import DashboardHeader from "@/components/dashboard/header";
import Breadcrumb from "@/components/dashboard/breadcrumb";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/components/providers/AuthProvider";
import { User } from "@/lib/db";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useContext(AuthContext);

  // For removing the main navbar and footer in dashboard layout
  useEffect(() => {
    document.body.classList.add("dashboard-layout");

    const navbar = document.querySelector("nav");
    const footer = document.querySelector("footer");

    if (navbar) navbar.style.display = "none";
    if (footer) footer.style.display = "none";

    return () => {
      // Clean up when unmounting
      document.body.classList.remove("dashboard-layout");
      if (navbar) navbar.style.display = "";
      if (footer) footer.style.display = "";
    };
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex">
          <DashboardSidebar user={user as User} />
          <div className="flex-1 w-full lg:ml-64">
            {" "}
            <DashboardHeader user={user as User} />
            <main className="p-4 md:p-6 lg:p-8">
              <Breadcrumb />
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
