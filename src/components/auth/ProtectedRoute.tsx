"use client";

import { useContext, useEffect, useState, ReactNode } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import Loading from "@/components/ui/loading";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, checkAuth } = useContext(AuthContext);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run verification if not already loading from AuthProvider
    if (!loading) {
      const verifyAuth = async () => {
        if (user) {
          setIsChecking(false);
        } else {
          // Double-check authentication status
          const isAuthenticated = await checkAuth();

          if (!isAuthenticated) {
            // Redirect to login without returnTo parameter
            router.replace("/login");
          } else {
            setIsChecking(false);
          }
        }
      };

      verifyAuth();
    }
  }, [user, loading, router, checkAuth]);

  if (loading || isChecking) {
    return <Loading />;
  }

  return <>{children}</>;
}
