import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteReview from "./DeleteReview";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

const Review = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [headerDate, setHeaderDate] = useState("");
  const [sortType, setSortType] = useState("date");
  const [modalImage, setModalImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://menuadv.azurewebsites.net/api/v1/Review?ProductId=${productId}&PageNumber=1&PageSize=10`
        );
        setReviews(response.data.data);

        const responseDate = response.headers["date"];
        if (responseDate) {
          setHeaderDate(responseDate);
        }

        sortReviews(response.data.data, sortType);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();

    const tokenCookie = getCookie("token");
    if (tokenCookie) {
      const token = JSON.parse(tokenCookie);
      const decodedToken = jwtDecode(token.jwToken);
      const roles = decodedToken.roles || [];
      setIsAdmin(roles.includes("SuperAdmin"));
    }
  }, [productId]);

  const handleSortChange = (e) => {
    const newSortType = e.target.value;
    setSortType(newSortType);
    sortReviews(reviews, newSortType);
  };

  const sortReviews = (reviews, type) => {
    const sortedReviews = [...reviews].sort((a, b) => {
      if (type === "rating") {
        return b.rate - a.rate;
      } else if (type === "date") {
        return new Date(b.created || 0) - new Date(a.created || 0);
      }
      return 0;
    });
    setReviews(sortedReviews);
  };

  const formatDateString = (dateString) => {
    if (!dateString) return "No date provided";
    const date = new Date(dateString);
    if (isNaN(date)) return "No date provided";
    return date.toLocaleDateString();
  };

  const handleImageClick = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className="reviews mt-4 flex flex-col items-center w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <div className="mb-4 w-full flex justify-between items-center">
        <p className="font-bold">{`Total Reviews: ${reviews.length}`}</p>
        <select
          onChange={handleSortChange}
          value={sortType}
          className="border p-2 rounded"
        >
          <option value="date">Sort by Date</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>
      {reviews.map((review) => (
        <div className="flex" key={review.id}>
          <div className="review flex gap-4 items-center justify-between p-4 border border-slate-100 shadow-sm rounded=lg mb-4 w-[600px] lg:w-[800px] xl:w-[1000px]">
            <div className="grow">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <p className="font-bold">{review.userId}</p>
                  <p className="text-sm text-gray-500">
                    {formatDateString(review.created) ||
                      formatDateString(headerDate)}
                  </p>
                </div>
              </div>
              <p className="mb-2">{review.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="font-bold mr-2">Price:</p>
                  <p>{review.price}₺</p>
                </div>
                <div className="flex items-center">
                  <p className="font-bold mr-2">Rating:</p>
                  <p>{review.rate}/5</p>
                </div>
              </div>
            </div>
            {review.image && (
              <img
                src={`data:image/jpeg;base64,${review.image}`}
                alt="User uploaded"
                className="w-32 h-32 object-cover rounded-lg cursor-pointer "
                onClick={() => handleImageClick(review.image)}
              />
            )}
          </div>
          {isAdmin && (
            <div className="my-auto">
              <DeleteReview reviewId={review.id} productId={productId} />
            </div>
          )}
        </div>
      ))}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <img
            src={`data:image/jpeg;base64,${modalImage}`}
            alt="User uploaded"
            className="max-w-full max-h-full"
          />
        </div>
      )}
    </div>
  );
};

export default Review;
