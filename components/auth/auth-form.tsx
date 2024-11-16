"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

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
import { userAuthSchema } from "@/lib/validation/auth";
import { useFormState } from "@/lib/context/form-context";
import { useForm } from "react-hook-form";

type FormData = z.infer<typeof userAuthSchema>;

export function AuthForm() {
  const router = useRouter();
  const { dispatch } = useFormState();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const user = await response.json();
      dispatch({ type: "SET_USER", payload: user });
      dispatch({ type: "SET_STEP", payload: "seller" });
      router.push("/add-seller");
    } catch (error) {
      console.error("Authentication error:", error);
      // Handle error appropriately
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
                <Input placeholder="Enter your name" {...field} />
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
