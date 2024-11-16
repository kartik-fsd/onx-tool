import { useState } from "react";
import { SellerWithProducts } from "@/types/dashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatPhoneNumber } from "@/lib/utils";
import Image from "next/image";

interface SellerListProps {
  sellers: SellerWithProducts[];
}

export function SellerList({ sellers }: SellerListProps) {
  const [selectedSeller, setSelectedSeller] =
    useState<SellerWithProducts | null>(null);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>GST Number</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Added By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellers.map((seller) => (
              <TableRow key={seller.id}>
                <TableCell className="font-medium">{seller.name}</TableCell>
                <TableCell>{formatPhoneNumber(seller.phone)}</TableCell>
                <TableCell>{seller.gstNumber}</TableCell>
                <TableCell>{seller.products.length}</TableCell>
                <TableCell>{seller.user.name}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedSeller(seller)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    {selectedSeller && (
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Seller Details</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-semibold">Shop Image</h3>
                              <div className="mt-2 aspect-video relative rounded-lg overflow-hidden">
                                <Image
                                  src={selectedSeller.shopImage}
                                  alt="Shop"
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <span className="font-semibold">Name:</span>{" "}
                                {selectedSeller.name}
                              </div>
                              <div>
                                <span className="font-semibold">Phone:</span>{" "}
                                {formatPhoneNumber(selectedSeller.phone)}
                              </div>
                              <div>
                                <span className="font-semibold">
                                  GST Number:
                                </span>{" "}
                                {selectedSeller.gstNumber}
                              </div>
                              <div>
                                <span className="font-semibold">Added By:</span>{" "}
                                {selectedSeller.user.name}
                              </div>
                              <div>
                                <span className="font-semibold">
                                  Total Products:
                                </span>{" "}
                                {selectedSeller.products.length}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h3 className="font-semibold">Products</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {selectedSeller.products.map((product) => (
                                <div
                                  key={product.id}
                                  className="border rounded-lg p-4 space-y-2"
                                >
                                  <div className="aspect-video relative rounded-lg overflow-hidden">
                                    <Image
                                      src={product.frontImage}
                                      alt={product.name}
                                      className="absolute inset-0 w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="font-medium">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    MRP: ₹{product.mrp} | MSP: ₹{product.msp}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
