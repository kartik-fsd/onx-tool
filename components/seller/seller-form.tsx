"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";

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

import { useFormState } from "@/lib/context/form-context";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { sellerFormSchema } from "@/lib/validation/seller";

type FormData = z.infer<typeof sellerFormSchema>;

export function SellerForm() {
  const router = useRouter();
  const { state, dispatch } = useFormState();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(sellerFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      gstNumber: "",
    },
  });

  async function onSubmit(data: FormData) {
    if (!state.user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated. Please sign in again.",
        variant: "destructive",
      });
      router.push("/");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone);
      formData.append("gstNumber", data.gstNumber);
      formData.append("userId", state.user.id);
      formData.append("shopImage", data.shopImage[0]);

      const response = await fetch("/api/sellers", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create seller");
      }

      const seller = await response.json();
      dispatch({ type: "SET_SELLER", payload: seller });
      dispatch({ type: "SET_STEP", payload: "products" });

      toast({
        title: "Success",
        description: "Seller information saved successfully.",
      });

      router.push("/add-products");
    } catch (error) {
      console.error("Seller creation error:", error);
      toast({
        title: "Error",
        description: "Failed to save seller information. Please try again.",
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
              <FormLabel>Seller Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter seller name" {...field} />
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
                  placeholder="Enter seller phone number"
                  type="tel"
                  maxLength={10}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gstNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GST Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter GST number"
                  maxLength={15}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shopImage"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Shop Image</FormLabel>
              <FormControl>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                    {previewImage ? (
                      <Image
                        src={previewImage}
                        alt="Shop preview"
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                        width={400}
                        height={500}
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPreviewImage(URL.createObjectURL(file));
                          onChange(e.target.files);
                        }
                      }}
                      {...field}
                    />
                  </div>
                  {previewImage && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPreviewImage(null);
                        onChange(null);
                      }}
                    >
                      Remove Image
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save and Continue"}
        </Button>
      </form>
    </Form>
  );
}
