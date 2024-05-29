"use client";
import React from "react";
import DeleteReview from "@components/DeleteReview";
import { FiShare } from "react-icons/fi";
import Link from "next/link";

function ReviewCard({ reviews }) {
  return (
    <div className="">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center">Image</th>
            <th className="px-4 py-2 text-center">Rate</th>
            <th className="px-4 py-2 text-center">Description</th>
            <th className="px-4 py-2 text-center">Price</th>
            <th className="px-4 py-2 text-center">Created</th>
            <th className="px-4 py-2 text-center">Place ID</th>
            <th className="px-4 py-2 text-center">Product ID</th>
            <th className="px-4 py-2 text-center">Review ID</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id} className="border-t">
              <td className="px-4 py-2 w-32 h-32 text-center">
                {review.image && (
                  <img
                    src={`data:image/jpeg;base64,${review.image}`}
                    alt="Review"
                    className="w-32 h-32 object-cover rounded-sm"
                  />
                )}
              </td>
              <td className="px-4 py-2 text-center">{review.rate}</td>
              <td className="px-4 py-2 max-w-[500px] overflow-hidden line-clamp-3 text-center">
                {review.description}
              </td>
              <td className="px-4 py-2 text-center">{review.price}₺</td>
              <td className="px-4 py-2 text-center">
                {new Date(review.created).toLocaleString()}
              </td>
              <td className="px-4 py-2 text-center">{review.placeId}</td>
              <td className="px-4 py-2 text-center">{review.productId}</td>
              <td className="px-4 py-2 text-center">{review.id}</td>
              <td className="px-4 py-2 text-center">
                <div className="flex flex-col items-center">
                  <DeleteReview reviewId={review.id} />
                  {review.placeId && (
                    <Link
                      key={review.id}
                      href={`/store/${review.placeId}/product/${review.productId}`}
                    >
                      <FiShare className="mt-4" />
                    </Link>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReviewCard;
