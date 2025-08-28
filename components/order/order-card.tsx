"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Comment, OrderProduct } from "@prisma/client";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import axios from "axios";
import { cn, formatDeliveryDate } from "@/lib/utils";
import {
  Package,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Rating } from "./rating";
import { Review } from "./review";
import { toast } from "sonner";
import { CancelOrderButton } from "../store/CancelOrderButton";
import { useState, useRef } from "react";
import { InvoiceData } from "@/types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Invoice from "../store/Invoice";
import { getInvoice } from "@/actions/get-invoice";

interface OrderCardProps {
  data: OrderProduct & {
    color: string;
    comment: Comment | null;
  };
  date: Date;
  paid: boolean;
  status: string;
  orderNumber: string | null;
  estimatedDeliveryDays: number | null;
  orderId: string;
  backendOrderId: string;
  mrp: number | null;
  price: number | null;
  paymentMethod: string | null;
  onCancel: () => void;
  noOfProducts:number;
}

export const OrderCard = ({
  data,
  date,
  paid,
  status,
  orderNumber,
  estimatedDeliveryDays,
  orderId,
  mrp,
  noOfProducts,
  backendOrderId,
  price,
  paymentMethod,
  onCancel,
}: OrderCardProps) => {
  const router = useRouter();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          icon: Clock,
          label: "Pending",
        };
      case "PROCESSING":
        return {
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          icon: Package,
          label: "Processing",
        };
      case "SHIPPED":
        return {
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
          icon: Truck,
          label: "Shipped",
        };
      case "DELIVERED":
        return {
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          icon: CheckCircle,
          label: "Delivered",
        };
      case "CANCELLED":
      case "RETURNED":
      case "REFUNDED":
        return {
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: XCircle,
          label:
            status === "CANCELLED"
              ? "Cancelled"
              : status === "RETURNED"
              ? "Returned"
              : "Refunded",
        };
      default:
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          icon: Package,
          label: "Unknown",
        };
    }
  };

  const handleDownloadInvoice = async () => {
    setIsLoading(true);
    try {
      const data = await getInvoice(backendOrderId);
      setInvoiceData(data);

      // Wait for the component to render with the new data
      setTimeout(() => {
        if (invoiceRef.current) {
          html2canvas(invoiceRef.current, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 0;
            pdf.addImage(
              imgData,
              "PNG",
              imgX,
              imgY,
              imgWidth * ratio,
              imgHeight * ratio
            );
            pdf.save(`invoice_${data.soldBy.invoiceNo}.pdf`);
            setInvoiceData(null); // Clear invoice data after download
          });
        }
      }, 100); // Small delay to ensure rendering
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error("Failed to generate invoice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  return (
    <>
      <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        {/* Header */}
        <div
          className={cn(
            "px-6 py-4 border-b border-gray-100",
            statusInfo.bgColor
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  statusInfo.bgColor,
                  statusInfo.borderColor,
                  "border-2"
                )}
              >
                <StatusIcon className={cn("w-5 h-5", statusInfo.color)} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Order #{orderNumber || "Pending"}
                </h3>
                <div
                  className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    statusInfo.bgColor,
                    statusInfo.color,
                    statusInfo.borderColor,
                    "border"
                  )}
                >
                  {statusInfo.label}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {["PENDING", "PROCESSING"].includes(status) && (
                <CancelOrderButton
                  orderId={orderId}
                  onCancel={onCancel}
                  variant="outline"
                  size="sm"
                  showFullWidth={false}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                />
              )}
              <Button
                onClick={handleDownloadInvoice}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              >
                <Download className="w-4 h-4 mr-2" />
                {isLoading ? "Generating..." : "Download Invoice"}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Order Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Placed {format(date, "MMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className={paid ? "text-emerald-600" : "text-amber-600"}>
                {paid ? "Paid" : "Payment Pending"}
              </span>
            </div>
            {estimatedDeliveryDays &&
              ["PENDING", "PROCESSING", "SHIPPED"].includes(status) && (
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>
                    Delivery by {formatDeliveryDate(estimatedDeliveryDays)}
                  </span>
                </div>
              )}
          </div>

          {/* Product Details */}
          <div
            className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
            onClick={() => router.push(`/orders/${data.id}`)}
          >
            <div className="relative flex-shrink-0">
              <div className="w-20 h-24 rounded-lg overflow-hidden bg-white shadow-sm">
                <Image
                  src={data.productImage}
                  alt="Product"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {data.name}
                  </h4>
                  {!data.about.startsWith("{") && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {data.about}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    {/* <div className="flex items-center gap-1">
                      <span className="text-gray-500">Size:</span>
                      <span className="font-medium text-gray-700">
                        {data.size}
                      </span>
                    </div> */}
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">Total numbers of Products:</span>
                      <span className="font-medium text-gray-700">
                        {noOfProducts}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">Total Price:</span>
                      <span className="font-medium text-gray-900">
                        {formatter.format(price || 0)}
                      </span>
                    </div>
                    <br />
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">Payment Method:</span>
                      <span className="font-medium text-gray-900">
                        {paymentMethod === "cod"
                          ? "Cash On Delivery"
                          : "Payment Online"}
                      </span>
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors ml-4 flex-shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Invoice Component for PDF Generation */}
      {invoiceData && (
        <div style={{ position: "absolute", left: "-9999px" }}>
          <Invoice invoiceData={invoiceData} invoiceRef={invoiceRef} />
        </div>
      )}
    </>
  );
};
