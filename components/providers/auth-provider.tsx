"use client";
import { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "@/lib/context/form-context";

const AuthContext = createContext<{ isAuthenticated: boolean } | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { state } = useFormState();
  const isAuthenticated = Boolean(state.user);

  useEffect(() => {
    if (!isAuthenticated && window.location.pathname !== "/") {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
