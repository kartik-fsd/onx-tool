"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "@/lib/context/form-context";
import { ProductForm } from "@/components/products/product-form";
import { ProductList } from "@/components/products/product-list";
import { Button } from "@/components/ui/button";
import { uploadToS3 } from "@/lib/s3-utils";
import { toast } from "@/hooks/use-toast";
import { MINIMUM_PRODUCTS, MAXIMUM_PRODUCTS } from "@/constants";
import { Product, ProductFormData } from "@/types/product";

export default function AddProducts() {
  const router = useRouter();
  const { state, dispatch } = useFormState();
  const [isLoading, setIsLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddProduct = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      // Upload images to S3
      const [frontImageUrl, sideImageUrl, backImageUrl] = await Promise.all([
        uploadToS3(data.frontImage[0], "products"),
        uploadToS3(data.sideImage[0], "products"),
        uploadToS3(data.backImage[0], "products"),
      ]);

      const productData: Omit<
        Product,
        "id" | "sellerId" | "createdAt" | "updatedAt"
      > = {
        name: data.name,
        mrp: data.mrp,
        msp: data.msp,
        frontImage: frontImageUrl,
        sideImage: sideImageUrl,
        backImage: backImageUrl,
      };

      if (editingIndex !== null) {
        dispatch({
          type: "UPDATE_PRODUCT",
          payload: { index: editingIndex, product: productData },
        });
        setEditingIndex(null);
      } else {
        if (state.products.length >= MAXIMUM_PRODUCTS) {
          toast({
            title: "Maximum limit reached",
            description: `You can only add up to ${MAXIMUM_PRODUCTS} products.`,
            variant: "destructive",
          });
          return;
        }
        dispatch({ type: "ADD_PRODUCT", payload: productData });
      }

      toast({
        title: "Success",
        description: "Product saved successfully.",
      });
    } catch (error) {
      console.error("Product save error:", error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAll = async () => {
    if (state.products.length < MINIMUM_PRODUCTS) {
      toast({
        title: "Not enough products",
        description: `Please add at least ${MINIMUM_PRODUCTS} products before submitting.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sellerId: state.seller?.id,
          products: state.products,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit products");
      }

      toast({
        title: "Success",
        description: "All products submitted successfully.",
      });

      // Reset form state
      dispatch({ type: "RESET_FORM" });
      router.push("/dashboard");
    } catch (error) {
      console.error("Product submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFormDefaultValues = (
    product: Partial<Product> | undefined
  ): Partial<ProductFormData> | undefined => {
    if (!product) return undefined;

    return {
      name: product.name,
      mrp: product.mrp,
      msp: product.msp,
    };
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Add Products</h1>
        <p className="text-sm text-muted-foreground">
          Add at least {MINIMUM_PRODUCTS} products (maximum {MAXIMUM_PRODUCTS})
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <ProductForm
            onSubmit={handleAddProduct}
            isLoading={isLoading}
            defaultValues={getFormDefaultValues(
              editingIndex !== null ? state.products[editingIndex] : undefined
            )}
          />
          {state.products.length >= MINIMUM_PRODUCTS && (
            <Button
              className="w-full"
              onClick={handleSubmitAll}
              disabled={isLoading}
            >
              Submit All Products
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">
              Added Products ({state.products.length}/{MAXIMUM_PRODUCTS})
            </h2>
          </div>
          <ProductList
            products={state.products}
            onEdit={setEditingIndex}
            onDelete={(index) => {
              dispatch({ type: "REMOVE_PRODUCT", payload: index });
              toast({
                title: "Product removed",
                description: "The product has been removed from the list.",
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
