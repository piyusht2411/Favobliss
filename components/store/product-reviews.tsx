"use client";

import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { FaStar, FaTrash } from "react-icons/fa";
import { AddReviewForm } from "./AddReviewForm";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getSubCategoryById } from "@/actions/get-subcategory";

interface Review {
  id: string;
  userName: string;
  rating: number;
  text: string;
  images: { url: string }[];
  videos: { url: string }[];
  createdAt: string;
  userId: string;
  categoryRatings: { categoryName: string; rating: number }[];
}

interface ProductReviewsProps {
  productId: string;
  avgRating: number | null;
  setAvgRating: Dispatch<SetStateAction<number | null>>;
  totalReviews: number;
  setTotalReviews: Dispatch<SetStateAction<number>>;
  subCategoryId: string;
  reviewsRef?: React.RefObject<HTMLDivElement>;
}

const CircularProgress = ({
  value,
  size = 60,
  strokeWidth = 4,
  color = "#22c55e",
  className = "",
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 5) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-base font-bold text-gray-800">
          {value.toFixed(1)}
        </span>
      </div>
    </div>
  );
};

const getRatingColor = (rating: number) => {
  if (rating >= 3.5) return "#22c55e";
  if (rating >= 2) return "#f59e0b";
  return "#ef4444";
};

export const ProductReviews = (props: ProductReviewsProps) => {
  const {
    productId,
    avgRating,
    setAvgRating,
    totalReviews,
    setTotalReviews,
    subCategoryId,
    reviewsRef,
  } = props;
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVideo, setSelectedVideo] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryAverages, setCategoryAverages] = useState<
    { categoryName: string; averageRating: number }[]
  >([]);
  const [subCategory, setSubCategory] = useState<any>(null);

  const isAdmin = session?.user?.email === "favoblis@gmail.com";

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

      // Calculate category averages
      const categoryRatingsMap: {
        [key: string]: { total: number; count: number };
      } = {};
      sortedReviews.forEach((review: any) => {
        review.categoryRatings?.forEach((cr: any) => {
          if (!categoryRatingsMap[cr.categoryName]) {
            categoryRatingsMap[cr.categoryName] = { total: 0, count: 0 };
          }
          categoryRatingsMap[cr.categoryName].total += cr.rating;
          categoryRatingsMap[cr.categoryName].count += 1;
        });
      });
      const averages = Object.keys(categoryRatingsMap).map((categoryName) => ({
        categoryName,
        averageRating: categoryRatingsMap[categoryName].count
          ? Number(
              (
                categoryRatingsMap[categoryName].total /
                categoryRatingsMap[categoryName].count
              ).toFixed(2)
            )
          : 0,
      }));
      setCategoryAverages(averages);
    } catch (error) {
      console.error("[PRODUCT_REVIEWS]", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubCategory = async () => {
    try {
      const data = await getSubCategoryById(subCategoryId);
      setSubCategory(data);
    } catch (error) {
      console.error("[FETCH_SUBCATEGORY]", error);
    }
  };

  const refreshReviews = () => {
    fetchReviews();
  };

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
      toast.error("Failed to delete review. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchSubCategory();
  }, [productId, subCategoryId]);

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage("");
  };

  const openVideoModal = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setSelectedVideo("");
  };

  const allReviewImages = reviews.flatMap((review) =>
    review.images.map((img) => ({
      ...img,
      reviewId: review.id,
      userName: review.userName,
    }))
  );

  const allReviewVideos = reviews.flatMap((review) =>
    review?.videos?.map((vid) => ({
      ...vid,
      reviewId: review.id,
      userName: review.userName,
    }))
  );

  const canDeleteReview = (review: Review) => {
    if (!session?.user) return false;
    if (isAdmin) return true;
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
          <div className="text-yellow-400 text-6xl mb-4 flex justify-center items-center">
            <FaStar />
          </div>
          <p className="text-gray-600 text-lg mb-2">No reviews yet</p>
          <p className="text-gray-500">
            Be the first to share your experience!
          </p>
        </div>
        <AddReviewForm
          productId={productId}
          onReviewSubmitted={refreshReviews}
          subCategoryId={subCategoryId}
        />
      </div>
    );
  }

  return (
    <div
      className="w-full bg-white rounded-lg shadow-sm border"
      ref={reviewsRef}
    >
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Customer Reviews
        </h2>

        {(allReviewImages.length > 0 || allReviewVideos.length > 0) && (
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allReviewImages.slice(0, 5).map((image, index) => (
                <div
                  key={`image-${index}`}
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
              {allReviewVideos.slice(0, 5).map((video, index) => (
                <div
                  key={`video-${index}`}
                  className="flex-shrink-0 relative cursor-pointer group"
                  onClick={() => openVideoModal(video.url)}
                >
                  <video
                    src={video.url}
                    className="h-16 w-16 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                    muted
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 text-xs">
                      Play
                    </span>
                  </div>
                </div>
              ))}
              {allReviewImages.length + allReviewVideos.length > 5 && (
                <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-600">
                    +{allReviewImages.length + allReviewVideos.length - 5}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex md:flex-nowrap flex-wrap items-start w-full gap-[50px] md:gap-2 justify-between">
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 md:gap-8 md:w-1/2 w-full">
            {/* Overall Rating */}
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <CircularProgress
                  value={avgRating}
                  size={80}
                  strokeWidth={6}
                  color={getRatingColor(avgRating)}
                />
              </div>
              <div className="text-center">
                {/* <div className="text-2xl font-bold text-gray-800 mb-1">
                  {avgRating.toFixed(1)} ★
                </div> */}
                <div className="text-sm text-gray-500">
                  {totalReviews.toLocaleString()} Ratings &{" "}
                  {reviews.length.toLocaleString()} Reviews
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.rating === star).length;
                const percentage =
                  totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-1 md:gap-3">
                    <div className="flex items-center gap-1 w-8">
                      <span className="text-sm text-gray-600">{star}</span>
                      <FaStar className="h-3 w-3 text-gray-400" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300 bg-green-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-2 md:w-12 text-right">
                      {count.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          {subCategory?.reviewCategories?.length > 0 &&
            categoryAverages.length > 0 && (
              <div className="md:w-[40%] w-full">
                <div className="flex items-center justify-between overflow-x-auto scrollbar-hide gap-6">
                  {categoryAverages.map((cat) => {
                    const reviewCategories = subCategory.reviewCategories.map(
                      (rc: { name: string }) => rc.name
                    );
                    if (!reviewCategories.includes(cat.categoryName))
                      return null;

                    const color = getRatingColor(cat.averageRating);

                    return (
                      <div
                        key={cat.categoryName}
                        className="flex flex-col items-center text-center"
                      >
                        <div className="mb-3">
                          <CircularProgress
                            value={cat.averageRating}
                            size={60}
                            className="md:w-[80px] md:h-[80px]"
                            strokeWidth={6}
                            color={color}
                          />
                        </div>
                        <div className="text-sm font-medium text-gray-700 capitalize">
                          {cat.categoryName}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
        </div>
      </div>

      <div className="p-6 border-b bg-gray-50">
        <AddReviewForm
          productId={productId}
          onReviewSubmitted={refreshReviews}
          subCategoryId={subCategoryId}
        />
      </div>

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
                      {(review.images.length > 0 ||
                        review.videos.length > 0) && (
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                          {review.images.map((image, index) => (
                            <img
                              key={`image-${index}`}
                              src={image.url}
                              alt={`Review image ${index + 1}`}
                              className="h-20 w-20 object-cover rounded-lg border cursor-pointer flex-shrink-0"
                              onClick={() => openImageModal(image.url)}
                            />
                          ))}
                          {review.videos.map((video, index) => (
                            <div
                              key={`video-${index}`}
                              className="relative flex-shrink-0 cursor-pointer"
                              onClick={() => openVideoModal(video.url)}
                            >
                              <video
                                src={video.url}
                                className="h-20 w-20 object-cover rounded-lg border"
                                muted
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 text-xs">
                                  View
                                </span>
                              </div>
                            </div>
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
              remove the review and all associated images and videos.
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

      {showVideoModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeVideoModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <video
              src={selectedVideo}
              controls
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={closeVideoModal}
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
