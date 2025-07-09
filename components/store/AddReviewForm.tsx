"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaStar, FaCamera, FaTimes } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";

interface AddReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void; // Add callback for refresh
}

export const AddReviewForm = ({
  productId,
  onReviewSubmitted,
}: AddReviewFormProps) => {
  const { data: session, status } = useSession();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const userName = session?.user?.name || "Anonymous User";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      if (images.length + newImages.length > 5) {
        toast.error("Maximum 5 images allowed");
        return;
      }
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in to submit a review.");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    setIsLoading(true);

    try {
      // Upload images to Cloudinary
      let imageUrls: string[] = [];
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((image) => formData.append("images", image));

        const uploadResponse = await fetch("/api/v1/image-upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload images");
        }

        const uploadData = await uploadResponse.json();
        imageUrls = uploadData.imageUrls;
      }

      // Submit review
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "omit",
          body: JSON.stringify({
            userName,
            rating,
            text,
            images: imageUrls,
            userId: session?.user?.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      toast.success("Review submitted successfully!");

      // Reset form
      setRating(0);
      setText("");
      setImages([]);
      setShowForm(false);

      // Call the callback to refresh reviews
      onReviewSubmitted();
    } catch (error) {
      console.error("[ADD_REVIEW_FORM]", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const ratingLabels: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  return (
    <div className="w-full">
      {!showForm ? (
        <div className="text-center py-4">
          <Button
            onClick={() => setShowForm(true)}
            className="bg-orange-400 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            disabled={!isAuthenticated}
          >
            Write a Review
          </Button>
          {!isAuthenticated && (
            <p className="text-sm text-gray-500 mt-2">
              <Link
                href="/auth/signin"
                className="text-blue-600 hover:underline"
              >
                Sign in
              </Link>{" "}
              to write a review
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Write Your Review
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`h-8 w-8 cursor-pointer transition-colors ${
                        (hoverRating || rating) >= star
                          ? (hoverRating || rating) >= 4
                            ? "text-green-500"
                            : (hoverRating || rating) >= 3
                            ? "text-yellow-400"
                            : "text-red-500"
                          : "text-gray-300"
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                </div>
                {(hoverRating || rating) > 0 && (
                  <span className="text-sm font-medium text-gray-700 ml-2">
                    {ratingLabels[hoverRating || rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your experience with this product..."
                className="min-h-[120px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {text.length}/1000 characters
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Photos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  disabled={images.length >= 5}
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer ${
                    images.length >= 5 ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  <FaCamera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {images.length >= 5
                      ? "Maximum 5 images"
                      : "Click to upload images"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPEG, PNG up to 5MB each
                  </p>
                </label>
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <FaTimes className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading || rating === 0 || !text.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </div>
                ) : (
                  "Submit Review"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-lg border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
