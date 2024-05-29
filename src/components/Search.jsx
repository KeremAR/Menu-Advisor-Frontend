"use client";
import React, { useState, useEffect } from 'react';
import StoreCard from './StoreCard';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const pageSize = 11; // Fixed page size

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://menuadv.azurewebsites.net/api/v1/Place?PageSize=${pageSize}&PageNumber=${page}&Name=${searchQuery}`);
        if (!response.ok) {
          throw new Error('Failed to fetch stores');
        }
        const data = await response.json();

        setStores(data.data);

        // Determine if this is the last page
        if (data.data.length < pageSize) {
          setIsLastPage(true);
        } else {
          setIsLastPage(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [searchQuery, page]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to the first page when search query changes
  };

  const handleNextPage = () => {
    if (!isLastPage) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="flex flex-col gap-10 mx-auto md:w-[800px] lg:w-[1000px] xl:w-[1200px] mt-[40px]">
      <input
        type="text"
        placeholder="Search stores..."
        value={searchQuery}
        onChange={handleSearch}
        className="border p-2 rounded mb-4"
      />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {stores.length > 0 ? (
            <>
              <StoreCard stores={stores} />
              <div className="flex gap-5 mt-4 mx-auto items-center mb-5">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="border p-2 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span>Page {page}</span>
                <button
                  onClick={handleNextPage}
                  disabled={isLastPage}
                  className="border p-2 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div>No stores found</div>
          )}
        </>
      )}
    </div>
  );
}

export default Search;
