"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';

function AddProduct({ storeData }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    placeId: storeData.data.id,
  });

  const router = useRouter();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getCookie("token");
    if (!token) {
      console.error("No token found. Unauthorized access.");
      return;
    }

    const tokenjwt = JSON.parse(token).jwToken;

    // Remove the prefix from the image data before sending it to the backend
    const requestBody = {
      ...formData,
      image: formData.image.replace(/^data:image\/\w+;base64,/, ''),
    };

    try {
      const response = await fetch('https://menuadv.azurewebsites.net/api/v1/Product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenjwt}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Failed to add product:', data);
        throw new Error(data.title || 'Failed to add product');
      }

      router.back();
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="z-50 add_product absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border rounded-lg shadow-lg w-[90%] lg:w-[70%] xl:w/[60%] flex flex-col max-h-[80vh] p-6">
      <div className='edit_profile overflow-y-auto flex flex-col gap-6 relative'>
        <div className='flex items-center justify-center '>
          <h1 className='border-b pb-5 font-bold border-orange-500 px-10 my-5 w-full text-center text-lg md:text-xl lg:text-2xl xl:text-3xl text-orange-500'>Add Product</h1>
          <button
            className='self-start mb-4 text-orange-500 hover:underline absolute right-0 top-0 font-bold'
            onClick={() => router.back()}
          >
            X
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="border p-2 rounded"
          />
          <button type="submit" className="bg-orange-500 text-white py-2 px-4 rounded">Add Product</button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
