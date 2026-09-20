"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthHeader from "../components/auth/AuthHeader";
import AuthCard from "../components/auth/AuthCard";
import AuthFooter from "../components/auth/AuthFooter";
import { useAuth } from "../components/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between select-none relative overflow-x-hidden font-sans transition-colors duration-300">
      {/* Subtle ambient glow in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header with Language & Theme toggles */}
      <AuthHeader />

      {/* 2. Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto z-10">
        <AuthCard />
      </main>

      {/* 3. Compliance Footer */}
      <AuthFooter />
    </div>
  );
}
