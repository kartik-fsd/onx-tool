import { SellerForm } from "@/components/seller/seller-form";

export default function AddSeller() {
  return (
    <div className="container flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[550px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Add Seller Information
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the seller&apos;s details and upload shop image
          </p>
        </div>
        <SellerForm />
      </div>
    </div>
  );
}
