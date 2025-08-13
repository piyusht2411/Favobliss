"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CancelOrderButtonProps {
  orderId: string;
  onCancel?: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showFullWidth?: boolean;
}

export const CancelOrderButton = ({
  orderId,
  onCancel,
  variant = "destructive",
  size = "default",
  className = "",
  showFullWidth = true,
}: CancelOrderButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCancelOrder = async () => {
    setIsLoading(true);
    try {
      await axios.patch(`/api/v1/order/${orderId}`, { action: "cancel" });
      toast.success("Order canceled successfully");

      // If onCancel callback is provided (for order-card), call it
      if (onCancel) {
        onCancel();
      } else {
        // If no callback (for order details page), redirect to orders
        router.push("/orders");
        router.refresh();
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`${showFullWidth ? "w-full" : ""} ${className}`}
          disabled={isLoading}
        >
          <XCircle className="w-4 h-4 mr-2" />
          Cancel Order
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to cancel this order?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Your order will be canceled and you
            will receive a refund if payment was already processed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Order</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancelOrder}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Canceling...
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 mr-2" />
                Yes, Cancel Order
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
