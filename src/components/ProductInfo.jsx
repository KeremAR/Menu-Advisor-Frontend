// components/ProductInfo.jsx

"use client";
import React, { useEffect, useState } from "react";
import DeleteProduct from "@components/DeleteProduct";
import { useRouter } from "next/navigation";
import { MdEdit } from "react-icons/md";

function ProductInfo({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placeId, setPlaceId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://menuadv.azurewebsites.net/api/v1/Product/${productId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }
        const data = await response.json();
        setProduct(data.data);
        setPlaceId(data.data.placeId);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const imageSrc = product.image?.startsWith("data:image/")
    ? product.image
    : `data:image/jpeg;base64,${product.image}`;

  const handleEditClick = () => {
    router.push(`/store/${placeId}/product/${productId}/editproduct`);
  };

  return (
    <div className="product-info my-8  w-[800px] lg:w-[1000px] xl:w-[1200px]  flex ">
      <div className="flex items-center mr-5">
        <div className="flex flex-col items-center gap-10 mx-4">
          <DeleteProduct productId={productId} placeId={placeId} />
          <button>
            <MdEdit className="text-2xl" onClick={handleEditClick} />
          </button>
        </div>

        {product.image && (
          <img
            src={imageSrc}
            alt={product.name}
            className="max-w-[300px] lg:max-w-[400px] xl:max-w-[500px] max-h-[200px] lg:max-h-[300px] xl:max-h-[400px]"
          />
        )}
      </div>
      <div className="flex justify-between w-full">
        <div className="ml-4  flex flex-col gap-1">
          {product.rate !== -1 && <p className="text-sm">{product.rate}/5</p>}
          <h1 className="font-bold">{product.name}</h1>
          <p>{product.description}</p>
        </div>
        <p className=" flex flex-col items-center mx-auto ">
          <span className="underline">Price:</span>
          <span>{product.price}</span>
        </p>
      </div>
    </div>
  );
}

export default ProductInfo;
