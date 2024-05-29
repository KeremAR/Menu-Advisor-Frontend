"use client"
import React from 'react'
import Hero from '@components/Hero'
import { useState, useEffect } from 'react';
import AddProduct from '@components/AddProduct'
import { useParams } from 'next/navigation';



function AddProductPage() {
  const queryParams = useParams();
  const {storeId} = queryParams;
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch(`https://menuadv.azurewebsites.net/api/v1/Place/${storeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch store data');
        }
        const data = await response.json();

        setStore(data);
      } catch (error) {
        console.error(error);
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
        <AddProduct storeData={store} />
    </div>
  )
}

export default AddProductPage