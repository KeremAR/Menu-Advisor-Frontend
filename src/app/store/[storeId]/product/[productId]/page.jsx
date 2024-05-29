"use client";
import React, { useState, useEffect } from "react";
import Hero from "@components/Hero";
import { useParams } from "next/navigation";
import ProductInfo from "@components/ProductInfo";
import Review from "@components/Review";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";

function ProductPage() {
  const { storeId, productId } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewImages, setReviewImages] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://menuadv.azurewebsites.net/api/v1/Review?ProductId=${productId}&PageNumber=1&PageSize=10`
        );
        const reviewsData = response.data.data;
        setReviews(reviewsData);

        const images = reviewsData
          .filter((review) => review.image)
          .map((review) => `data:image/jpeg;base64,${review.image}`);
        setReviewImages(images);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [productId]);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch(
          `https://menuadv.azurewebsites.net/api/v1/Place/${storeId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch store data");
        }
        const data = await response.json();
        setStore(data);
      } catch (error) {
        console.error("Error fetching store data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchStoreData();
    }
  }, [storeId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!store) {
    return <div>Store not found</div>;
  }

  return (
    <div>
      <Hero storeData={store} />
      <div className="flex gap-8 items-center mt-4">
        <ProductInfo productId={productId} />
        {reviewImages.length > 0 && (
          <Carousel
            className="max-w-[100px] lg:max-w-[150px] xl:max-w-[200px] "
            showThumbs={false}
            infiniteLoop
            autoPlay
          >
            {reviewImages.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Review Image ${index + 1}`} />
              </div>
            ))}
          </Carousel>
        )}
      </div>
      <Review productId={productId} />
    </div>
  );
}

export default ProductPage;
