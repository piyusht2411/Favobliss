"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { InvoiceData } from "@/types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { getInvoice } from "@/actions/get-invoice";
import Invoice from "./Invoice";

interface DownloadInvoiceButtonProps {
  orderId: string;
  showfullWidth?: boolean;
}

export const DownloadInvoiceButton = ({
  orderId,
  showfullWidth = false,
}: DownloadInvoiceButtonProps) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownloadInvoice = async () => {
    setIsLoading(true);
    try {
      const data = await getInvoice(orderId);
      setInvoiceData(data);

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
            setInvoiceData(null);
          });
        }
      }, 100);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error("Failed to generate invoice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleDownloadInvoice}
        variant="outline"
        size={showfullWidth ? "default" : "sm"}
        disabled={isLoading}
        className={`text-amber-600 border-orange-200 bg-amber-50 hover:text-amber-600 rounded-full hover:bg-amber-50 ${
          showfullWidth ? "w-full" : ""
        }`}
      >
        <Download className="w-4 h-4 mr-2" />
        {isLoading ? "Generating..." : "Invoice"}
      </Button>
      {invoiceData && (
        <div style={{ position: "absolute", left: "-9999px" }}>
          <Invoice invoiceData={invoiceData} invoiceRef={invoiceRef} />
        </div>
      )}
    </>
  );
};
