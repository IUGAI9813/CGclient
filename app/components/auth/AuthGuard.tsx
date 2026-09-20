"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../AuthContext";

// Routes that do not require authentication (exceptions list)
export const AUTH_EXCEPTIONS = ["/login"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) return;

    // Check if the current route is in the exceptions list
    const isException = AUTH_EXCEPTIONS.some(
      (route) => pathname === route || pathname?.startsWith(`${route}/`)
    );

    // If user is not authenticated and route is not in exceptions, redirect to /login
    if (!isAuthenticated && !isException) {
      router.push("/login");
    }
  }, [isAuthenticated, isAuthLoading, pathname, router]);

  return <>{children}</>;
}
