import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Camera, X } from "lucide-react";

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

import Image from "next/image";
import { productFormSchema } from "@/lib/validation/product";
import { ProductFormData } from "@/types/product";

type FormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<ProductFormData>;
}

export function ProductForm({
  onSubmit,
  isLoading,
  defaultValues,
}: ProductFormProps) {
  const [previews, setPreviews] = useState({
    frontImage: null as string | null,
    sideImage: null as string | null,
    backImage: null as string | null,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      mrp: defaultValues?.mrp || 0,
      msp: defaultValues?.msp || 0,
    },
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: any,
    imageType: keyof typeof previews
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({
          ...prev,
          [imageType]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
      field.onChange(e.target.files);
    }
  };

  const ImageUploadField = ({
    name,
    label,
  }: {
    name: string;
    label: string;
  }) => (
    <FormField
      control={form.control}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name={name as any}
      render={({ field: { onChange, ...field } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
              {previews[name as keyof typeof previews] ? (
                <>
                  <Image
                    src={previews[name as keyof typeof previews]!}
                    alt={`${name} preview`}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    width={400}
                    height={500}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setPreviews((prev) => ({
                        ...prev,
                        [name]: null,
                      }));
                      onChange(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) =>
                  handleImageChange(
                    e,
                    { onChange },
                    name as keyof typeof previews
                  )
                }
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="mrp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MRP</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter MRP"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="msp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MSP</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter MSP"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6">
          <ImageUploadField name="frontImage" label="Front Image" />
          <ImageUploadField name="sideImage" label="Side Image" />
          <ImageUploadField name="backImage" label="Back Image" />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Adding Product..." : "Add Product"}
        </Button>
      </form>
    </Form>
  );
}
