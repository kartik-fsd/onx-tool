"use client";
import { useEffect, useCallback } from "react";
import { useFormState } from "@/lib/context/form-context";
import { toast } from "@/hooks/use-toast";

export function FormPersistence() {
  const { state } = useFormState();

  // Handle beforeunload event
  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (state.isSubmitting) {
        e.preventDefault();
        e.returnValue = "";
      }
    },
    [state.isSubmitting]
  );

  // Handle offline/online status
  const handleOffline = () => {
    toast({
      title: "You're offline",
      description:
        "Don't worry, your data is saved. Please reconnect to continue.",
      variant: "destructive",
    });
  };

  const handleOnline = () => {
    toast({
      title: "You're back online",
      description: "You can continue with your submission.",
    });
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [handleBeforeUnload]);

  return null;
}
