"use client"
import React from 'react'
import Hero from '@components/Hero'
import { useState, useEffect } from 'react';
import storesData from "@data/stores.json";
import { useParams } from 'next/navigation';
import ProductCard from '@components/ProductCard';
import Search from '@components/Search';
import Review from '@components/Review';

function StorePage() {
  const queryParams = useParams();
  const { storeId } = queryParams;
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
      <ProductCard storeId={storeId} />
    </div>
  );
}

export default StorePage;