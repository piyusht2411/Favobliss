"use client";

import { usePreviewModal } from "@/hooks/use-preview-modal";
import { Modal } from "@/components/modal";
import { ModalGallery } from "@/components/gallery/modal-gallery";
import { ModalProductDetails } from "../store/modal-product-details";
import { useState } from "react";

export const PreviewModal = () => {
  const { isOpen, onClose, data } = usePreviewModal();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  if (!data) {
    return null;
  }

  const selectedVariant =
    data.variants?.[selectedVariantIndex] || data.variants?.[0];
  const images = selectedVariant?.images || [];

  const handleVariantChange = (index: number) => {
    setSelectedVariantIndex(index);
  };

  // Reset variant selection when modal opens with new data
  const handleClose = () => {
    setSelectedVariantIndex(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="w-full grid grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
        <div className="sm:col-span-4 lg:col-span-5">
          <ModalGallery images={images} />
        </div>
        <div className="sm:col-span-8 lg:col-span-7">
          <ModalProductDetails
            data={data}
            selectedVariantIndex={selectedVariantIndex}
            onVariantChange={handleVariantChange}
          />
        </div>
      </div>
    </Modal>
  );
};
