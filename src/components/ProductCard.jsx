"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CiCirclePlus } from "react-icons/ci";

function ProductCard({ storeId }) {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`https://menuadv.azurewebsites.net/api/v1/Product/GetProductByPlaceId/${storeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }
        const data = await response.json();

        if (data && Array.isArray(data.data)) {
          setProductData(data.data); // Set the products array
        } else {
          setProductData([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) {
      fetchProductData();
    }
  }, [storeId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product_card grid grid-cols-4 gap-10 mx-auto md:w-[800px] lg:w-[1000px] xl:w-[1200px] my-[40px]">
      {productData.length === 0 && (
        <div className="col-span-4 text-center">No products found.</div>
      )}
      {productData.map(product => {
        // Handle the base64 image string
        const imageSrc = product.image.startsWith('data:image/')
          ? product.image
          : `data:image/jpeg;base64,${product.image}`;

        return (
          <Link href={`/store/${storeId}/product/${product.id}`} key={product.id}>
            <div className="product border p-4 rounded flex flex-col justify-between h-[300px] lg:h-[350px] xl:h-[410px]">
              <div className='h-[110px] lg:h-[180px] xl:h-[220px] '>
                {product.image && (
                  <img
                    src={imageSrc}
                    alt={product.name}
                    className="w-full h-full object-cover "
                  />
                )}
              </div>
              <div>
                <div className='flex flex-col'>
                  <div className='flex justify-between items-center'>
                    <h3 className="text-lg font-bold overflow-hidden">{product.name}</h3>
                    {product.rate !== -1 && <p className='text-sm'>{product.rate}/5</p>}
                  </div>
                  <p className="text-sm text-gray-600 mb-2 overflow-hidden line-clamp-3">{product.description}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="flex flex-col items-center mx-auto">
                    <span className="underline">Price:</span>
                    <span>{product.price}₺</span>
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
      <Link href={`/store/${storeId}/addproduct`}>
        <div className="product border p-4 rounded flex flex-col items-center justify-center h-[300px] lg:h-[350px] xl:h-[410px]">
          <CiCirclePlus className='mx-auto text-5xl'/>
          <p>Add New Product</p>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
