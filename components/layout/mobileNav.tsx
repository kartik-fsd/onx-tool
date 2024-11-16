import Link from "next/link";
import { Home, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface MobileNavProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 top-14 z-50 grid h-[calc(100vh-3.5rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden",
        {
          hidden: !isOpen,
        }
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "flex w-full items-center gap-2 text-sm font-medium"
            )}
            onClick={onClose}
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link
            href="/add-seller"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "flex w-full items-center gap-2 text-sm font-medium"
            )}
            onClick={onClose}
          >
            <Plus className="h-4 w-4" />
            Add Seller
          </Link>
        </nav>
      </div>
    </div>
  );
}
