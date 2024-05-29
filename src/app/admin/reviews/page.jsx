"use client";
import React, { useState, useEffect } from 'react';
import ReviewCard from '@components/ReviewCard';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const pageSize = 10;

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://menuadv.azurewebsites.net/api/v1/Review?PageSize=${pageSize}&PageNumber=${page}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      const reviewsWithPlaceId = await Promise.all(
        data.data.map(async (review) => {
          const productResponse = await fetch(`https://menuadv.azurewebsites.net/api/v1/Product/${review.productId}`);
          const productData = await productResponse.json();
          return { ...review, placeId: productData.data.placeId };
        })
      );
      setReviews(reviewsWithPlaceId);

      if (data.data.length < pageSize) {
        setIsLastPage(true);
      } else {
        setIsLastPage(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const handleNextPage = () => {
    if (!isLastPage) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="flex flex-col gap-10 mx-auto md:w-[800px] lg:w-[1000px] xl:w-[1200px] mt-[40px]">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {reviews.length > 0 ? (
            <>
              <ReviewCard reviews={reviews} />
              <div className="flex gap-5 mt-4 mx-auto items-center mb-5">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="border p-2 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span>Page {page}</span>
                <button
                  onClick={handleNextPage}
                  disabled={isLastPage}
                  className="border p-2 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div>No reviews found</div>
          )}
        </>
      )}
    </div>
  );
}

export default Reviews;
