import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types";

interface ProductListProps {
  products: Partial<Product>[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {products.map((product, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-medium">{product.name}</h3>
              <div className="text-sm text-muted-foreground">
                MRP: ₹{product.mrp} | MSP: ₹{product.msp}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(index)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {expandedIndex === index && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {product.frontImage && (
                <div className="aspect-square relative">
                  <Image
                    src={product.frontImage}
                    alt="Front view"
                    className="absolute inset-0 w-full h-full object-cover rounded-md"
                    width={400}
                    height={500}
                  />
                </div>
              )}
              {product.sideImage && (
                <div className="aspect-square relative">
                  <Image
                    src={product.sideImage}
                    alt="Side view"
                    className="absolute inset-0 w-full h-full object-cover rounded-md"
                    width={400}
                    height={500}
                  />
                </div>
              )}
              {product.backImage && (
                <div className="aspect-square relative">
                  <Image
                    src={product.backImage}
                    alt="Back view"
                    width={400}
                    height={500}
                    className="absolute inset-0 w-full h-full object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
