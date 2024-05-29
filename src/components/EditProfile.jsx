"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

function EditProfile({ storeData }) {
  const [isEditing, setIsEditing] = useState({
    name: false,
    description: false,
    address: false,
    workingHours: false,
    image: false,
  });

  // Handle the base64 image string
  const imageSrc = storeData.data.image.startsWith("data:image/")
    ? storeData.data.image
    : `data:image/jpeg;base64,${storeData.data.image}`;

  const [formData, setFormData] = useState({
    name: storeData.data.name,
    description: storeData.data.description, // Assuming initial value for the description section
    address: storeData.data.address,
    workingHours: storeData.data.workingHours, // Assuming initial value for the working hours
    image: storeData.data.image, // Keep original image data
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
    const requestBody = { ...formData, id: storeData.data.id };

    // Remove the prefix from the image data before sending it to the backend, only if it was changed
    if (isEditing.image) {
      requestBody.image = requestBody.image.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
    }

    try {
      const response = await fetch(
        `https://menuadv.azurewebsites.net/api/v1/Place/${storeData.data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenjwt}`, // Include the token here
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

      setIsEditing((prev) => ({ ...prev, [field]: false }));
      router.back(); // Redirect to the previous page
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="z-50 edit_profile absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border rounded-lg w-[600px] lg:w-[800px] xl:w-[1000px] flex flex-col max-h-[80vh] ">
      <h1 className="border-b pb-5 font-bold border-orange-500  px-10 my-5 w-full text-orange-500 text-center text-lg md:text-xl lg:text-2xl xl:text-3xl">
        Edit Profile
      </h1>
      <button
        className=" text-orange-500 hover:underline absolute right-5 top-5 font-bold"
        onClick={() => router.back()}
      >
        X
      </button>
      <div className="edit_profile z-1 overflow-y-auto flex flex-col gap-6 relative">
        {/* Name */}
        <div className="flex justify-between">
          <h1 className="ml-6 font-bold text-lg md:text-xl lg:text-2xl xl:text-2xl">
            Name
          </h1>
          <button
            className="mr-6 underline text-orange-500"
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
          <p className="mx-auto">{formData.name}</p>
        )}

        {/* Description */}
        <div className="flex justify-between">
          <h1 className="ml-6 font-bold text-lg md:text-xl lg:text-2xl xl:text-2xl">
            About
          </h1>
          <button
            className="mr-6 underline text-orange-500"
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
            className="mx-auto border p-2 rounded w-[400px] lg:w-[500px] xl:w-[600px]"
          />
        ) : (
          <p className="mx-auto">{formData.description}</p>
        )}

        {/* Address */}
        <div className="flex justify-between">
          <h1 className="ml-6 font-bold text-lg md:text-xl lg:text-2xl xl:text-2xl">
            Address
          </h1>
          <button
            className="mr-6 underline text-orange-500"
            onClick={() =>
              isEditing.address
                ? handleSave("address")
                : handleEditClick("address")
            }
          >
            {isEditing.address ? "Save" : "Change"}
          </button>
        </div>
        {isEditing.address ? (
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="mx-auto border p-2 rounded  w-[400px] lg:w-[500px] xl:w-[600px]"
          />
        ) : (
          <p className="mx-auto">{formData.address}</p>
        )}

        {/* Working Hours */}
        <div className="flex justify-between">
          <h1 className="ml-6 font-bold text-lg md:text-xl lg:text-2xl xl:text-2xl">
            Working Hours
          </h1>
          <button
            className="mr-6 underline text-orange-500"
            onClick={() =>
              isEditing.workingHours
                ? handleSave("workingHours")
                : handleEditClick("workingHours")
            }
          >
            {isEditing.workingHours ? "Save" : "Change"}
          </button>
        </div>
        {isEditing.workingHours ? (
          <input
            type="text"
            name="workingHours"
            value={formData.workingHours}
            onChange={handleInputChange}
            className="mx-auto border p-2 rounded"
          />
        ) : (
          <p className="mx-auto">{formData.workingHours}</p>
        )}

        {/* Image */}
        <div className="flex justify-between">
          <h1 className="ml-6 font-bold text-lg md:text-xl lg:text-2xl xl:text-2xl">
            Cover Photo
          </h1>
          <button
            className="mr-6 underline text-orange-500"
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
              className="mx-auto border p-2 rounded"
            />
            <input
              type="hidden"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
            />
          </div>
        ) : (
          <Image
            src={imageSrc}
            alt="Background"
            width={300}
            height={300}
            className="w-[300px] lg:w-[400px] xl:w-[500px] mx-auto rounded-lg mb-[100px]"
          />
        )}
      </div>
    </div>
  );
}

export default EditProfile;
