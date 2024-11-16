// components/auth/auth-form.tsx
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userAuthSchema, type AuthFormData } from "@/lib/validation/auth";
import { useFormState } from "@/lib/context/form-context";

export function AuthForm() {
  const router = useRouter();
  const { dispatch } = useFormState();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AuthFormData>({
    resolver: zodResolver(userAuthSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  async function onSubmit(data: AuthFormData) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Authentication failed");
      }

      // Update form context with user data
      dispatch({
        type: "SET_USER",
        payload: {
          id: responseData.id,
          name: responseData.name,
          phone: responseData.phone,
          stats: responseData.stats,
        },
      });

      dispatch({ type: "SET_STEP", payload: "seller" });

      toast({
        title: "Welcome",
        description: `${responseData.message}. You've added ${responseData.stats.totalSellers} sellers and ${responseData.stats.totalProducts} products so far.`,
      });

      router.push("/add-seller");
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to authenticate",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your name"
                  {...field}
                  autoComplete="name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your phone number"
                  type="tel"
                  maxLength={10}
                  {...field}
                  autoComplete="tel"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}
