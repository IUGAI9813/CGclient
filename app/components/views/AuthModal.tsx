"use client";

import React from "react";
import AuthCard from "../auth/AuthCard";

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  canClose?: boolean;
}

export default function AuthModal({ isOpen, onClose, canClose = false }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-mono">
      <AuthCard
        onClose={onClose}
        canClose={canClose}
      />
    </div>
  );
}
