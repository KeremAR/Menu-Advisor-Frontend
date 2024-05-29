"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import EditProduct from '@components/EditProduct';

const EditProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`https://menuadv.azurewebsites.net/api/v1/Product/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }
        const data = await response.json();
        setProduct(data.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      
      <EditProduct productData={product} />
    </div>
  );
};

export default EditProductPage;
