"use client";

import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { FaStar, FaTrash } from "react-icons/fa";
import { AddReviewForm } from "./AddReviewForm";
import { useSession } from "next-auth/react";

interface Review {
  id: string;
  userName: string;
  rating: number;
  text: string;
  images: { url: string }[];
  createdAt: string;
  userId: string;
}

interface ProductReviewsProps {
  productId: string;
  avgRating: number | null;
  setAvgRating: Dispatch<SetStateAction<number | null>>;
  totalReviews: number;
  setTotalReviews: Dispatch<SetStateAction<number>>;
}

export const ProductReviews = (props: ProductReviewsProps) => {
  const { productId, avgRating, setAvgRating, totalReviews, setTotalReviews } =
    props;
  const { data: session } = useSession(); // Get user session
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/reviews?page=1&limit=100`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      const sortedReviews = data.sort((a: Review, b: Review) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      setReviews(sortedReviews);
      setTotalReviews(sortedReviews.length);
      const avg =
        data.reduce((sum: number, review: Review) => sum + review.rating, 0) /
        data.length;
      setAvgRating(avg || null);
    } catch (error) {
      console.error("[PRODUCT_REVIEWS]", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshReviews = () => {
    fetchReviews();
  };

  // Open delete confirmation modal
  const openDeleteModal = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setReviewToDelete(null);
  };

  const deleteReview = async () => {
    if (!reviewToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/reviews/${reviewToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      refreshReviews();
      closeDeleteModal();
    } catch (error) {
      console.error("[DELETE_REVIEW]", error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage("");
  };

  const allReviewImages = reviews.flatMap((review) =>
    review.images.map((img) => ({
      ...img,
      reviewId: review.id,
      userName: review.userName,
    }))
  );

  const canDeleteReview = (review: Review) => {
    if (!session?.user) return false;
    return (
      session.user.name === review.userName && session.user.id === review.userId
    );
  };

  if (isLoading) {
    return (
      <div className="w-full animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (totalReviews === 0 || !avgRating) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Customer Reviews
        </h2>
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">⭐</div>
          <p className="text-gray-600 text-lg mb-2">No reviews yet</p>
          <p className="text-gray-500">
            Be the first to share your experience!
          </p>
        </div>
        <AddReviewForm
          productId={productId}
          onReviewSubmitted={refreshReviews}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Customer Reviews
        </h2>

        {allReviewImages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Customer Photos
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allReviewImages.slice(0, 10).map((image, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 relative cursor-pointer group"
                  onClick={() => openImageModal(image.url)}
                >
                  <img
                    src={image.url}
                    alt={`Customer photo ${index + 1}`}
                    className="h-16 w-16 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 text-xs">
                      View
                    </span>
                  </div>
                </div>
              ))}
              {allReviewImages.length > 10 && (
                <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-600">
                    +{allReviewImages.length - 10}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rating Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Average Rating */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-1">
                {avgRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(avgRating)
                        ? avgRating >= 4
                          ? "text-green-500"
                          : avgRating >= 3
                          ? "text-yellow-400"
                          : "text-red-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500">
                {totalReviews} reviews
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="md:col-span-2">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.rating === star).length;
                const percentage = (count / totalReviews) * 100;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm text-gray-600">{star}</span>
                      <FaStar
                        className={`h-3 w-3 ${
                          star === 5
                            ? "text-green-500"
                            : star === 4
                            ? "text-green-400"
                            : star === 3
                            ? "text-yellow-400"
                            : star === 2
                            ? "text-orange-400"
                            : "text-red-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          star === 5
                            ? "bg-green-500"
                            : star === 4
                            ? "bg-green-400"
                            : star === 3
                            ? "bg-yellow-400"
                            : star === 2
                            ? "bg-orange-400"
                            : "bg-red-400"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Review Form */}
      <div className="p-6 border-b bg-gray-50">
        <AddReviewForm
          productId={productId}
          onReviewSubmitted={refreshReviews}
        />
      </div>

      {/* Reviews List */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            All Reviews ({totalReviews})
          </h3>
        </div>

        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 pb-6 last:border-b-0"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {review.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {review.userName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="mt-4">
                      {review.images.length > 0 && (
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image.url}
                              alt={`Review image ${index + 1}`}
                              className="h-20 w-20 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                              onClick={() => openImageModal(image.url)}
                            />
                          ))}
                        </div>
                      )}
                      <p className="text-gray-700 leading-relaxed">
                        {review.text}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? review.rating >= 4
                            ? "text-green-500"
                            : review.rating >= 3
                            ? "text-yellow-400"
                            : "text-red-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {review.rating}.0
                  </span>
                  {/* Delete Button */}
                  {canDeleteReview(review) && (
                    <button
                      onClick={() => openDeleteModal(review.id)}
                      className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200 group"
                      title="Delete Review"
                    >
                      <FaTrash className="h-3 w-3 group-hover:scale-110 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <FaTrash className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Review
                </h3>
                <p className="text-sm text-gray-600">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this review? This will permanently
              remove your review and all associated images.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={deleteReview}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash className="h-4 w-4" />
                    Delete Review
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <img
              src={selectedImage}
              alt="Review image"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
