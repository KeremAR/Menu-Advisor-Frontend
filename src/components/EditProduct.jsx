"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

function EditProduct({ productData }) {
  const [isEditing, setIsEditing] = useState({
    name: false,
    description: false,
    price: false,
    image: false,
  });

  // Handle the base64 image string
  const imageSrc = productData.image.startsWith("data:image/")
    ? productData.image
    : `data:image/jpeg;base64,${productData.image}`;

  const [formData, setFormData] = useState({
    name: productData.name,
    description: productData.description,
    price: productData.price,
    image: productData.image, // Keep original image data
  });

  const router = useRouter();

  const handleEditClick = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (field) => {
    const token = getCookie("token");

    if (!token) {
      console.error("No token found. Unauthorized access.");
      return;
    }

    const tokenjwt = JSON.parse(token).jwToken;

    // Clone formData to avoid modifying the original state directly
    const requestBody = {
      ...formData,
      id: productData.id,
      placeId: productData.placeId,
    };

    // Remove the prefix from the image data before sending it to the backend, only if it was changed
    if (isEditing.image) {
      requestBody.image = requestBody.image.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
    }

    try {
      const response = await fetch(
        `https://menuadv.azurewebsites.net/api/v1/Product/${productData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenjwt}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Failed to save:", errorResponse);
        throw new Error(
          `Failed to save ${field}, received status ${response.status}`
        );
      }

      const updatedProduct = await response.json();
      console.log("Save successful:", updatedProduct);

      setIsEditing((prev) => ({ ...prev, [field]: false }));
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="z-50 edit_profile absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border rounded-lg w-[600px] lg:w-[800px] xl:w-[1000px] flex flex-col max-h-[80vh] ">
      <h1 className="border-b pb-5 font-bold border-orange-500 px-10 my-5 w-full text-center text-lg md:text-xl lg:text-2xl xl:text-3xl text-orange-500">
        Edit Product
      </h1>
      <button
        className=" text-orange-500 hover:underline absolute right-5 top-5 font-bold"
        onClick={() => router.back()}
      >
        X
      </button>
      <div className="edit_profile overflow-y-auto flex flex-col gap-6 relative">
        <div className="flex items-center justify-center ">
          
        </div>

        {/* Name */}
        <div className="flex justify-between items-center mx-6">
          <h1 className="font-bold text-lg md:text-xl lg:text-2xl xl:text-2xl text-gray-700">
            Name
          </h1>
          <button
            className="underline text-orange-500"
            onClick={() =>
              isEditing.name ? handleSave("name") : handleEditClick("name")
            }
          >
            {isEditing.name ? "Save" : "Change"}
          </button>
        </div>
        {isEditing.name ? (
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mx-auto border p-2 rounded  w-[200px] lg:w-[300px] xl:w-[400px]"
          />
        ) : (
          <p className="text-center text-gray-600">{formData.name}</p>
        )}

        {/* Description */}
        <div className="flex justify-between items-center mx-6">
          <h1 className="font-bold text-lg md:text-xl lg:text-2xl xl:text-2xl text-gray-700">
            Description
          </h1>
          <button
            className="underline text-orange-500"
            onClick={() =>
              isEditing.description
                ? handleSave("description")
                : handleEditClick("description")
            }
          >
            {isEditing.description ? "Save" : "Change"}
          </button>
        </div>
        {isEditing.description ? (
          <input
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="border p-2 rounded mx-auto w-[400px] lg:w-[500px] xl:w-[600px]"
          />
        ) : (
          <p className="text-center text-gray-600">{formData.description}</p>
        )}

        {/* Price */}
        <div className="flex justify-between items-center mx-6">
          <h1 className="font-bold text-lg md:text-xl lg:text-2xl xl:text-2xl text-gray-700">
            Price
          </h1>
          <button
            className="underline text-orange-500"
            onClick={() =>
              isEditing.price ? handleSave("price") : handleEditClick("price")
            }
          >
            {isEditing.price ? "Save" : "Change"}
          </button>
        </div>
        {isEditing.price ? (
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="mx-auto border p-2 rounded  w-[200px] lg:w-[300px] xl:w-[400px]"
          />
        ) : (
          <p className="text-center text-gray-600">{formData.price}</p>
        )}

        {/* Image */}
        <div className="flex justify-between items-center mx-6">
          <h1 className="font-bold text-lg md:text-xl lg:text-2xl xl:text-2xl text-gray-700">
            Image
          </h1>
          <button
            className="underline text-orange-500"
            onClick={() =>
              isEditing.image ? handleSave("image") : handleEditClick("image")
            }
          >
            {isEditing.image ? "Save" : "Change"}
          </button>
        </div>
        {isEditing.image ? (
          <div className="mb-[100px] mx-auto">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border mx-auto p-2 rounded w-full"
            />
            <input
              type="hidden"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
            />
          </div>
        ) : (
          <img
            src={imageSrc}
            alt="Product"
            className="w-full h-auto mx-auto rounded-lg mb-[100px]"
          />
        )}
      </div>
    </div>
  );
}

export default EditProduct;
