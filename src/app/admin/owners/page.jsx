"use client";
import React, { useState, useEffect } from 'react';
import { fetchRestaurantOwnerDetails, getTokenFromCookie } from '../../utils/auth';

function OwnersPage() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchRestaurantOwnerDetails();
        setOwners(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching owners:', error);
        setError('Failed to fetch owners.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVerificationToggle = async (owner) => {
    try {
      const token = getTokenFromCookie();
      const updatedVerificationStatus = !owner.isVerified;
      console.log(`Updating owner ${owner.id} verification status to:`, updatedVerificationStatus);

      const response = await fetch(`https://menuadv.azurewebsites.net/api/v1/RestaurantOwner/${owner.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.jwToken}`
        },
        body: JSON.stringify({ ...owner, isVerified: updatedVerificationStatus }),
      });

      if (response.ok) {
        console.log('Update was successful.');
        setOwners(prevOwners =>
          prevOwners.map(o =>
            o.id === owner.id ? { ...o, isVerified: updatedVerificationStatus } : o
          )
        );
      } else {
        const errorData = await response.json();
        console.error('Failed to update restaurant owner:', errorData);
        throw new Error('Failed to update restaurant owner.');
      }
    } catch (error) {
      console.error('Error updating verification status:', error);
      setError('Failed to update verification status.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='flex flex-col items-center'>
      <h1 className='font-extrabold italic mb-5'>Restaurant Owners</h1>
      <table className="min-w-full bg-white">
        <thead>
        <tr>
            <th className="px-4 py-2 text-center">ID</th>
            <th className="px-4 py-2 text-center">Restaurant ID</th>
            <th className="px-4 py-2 text-center">Owner Username</th>
            <th className="px-4 py-2 text-center">Store Name</th>
            <th className="px-4 py-2 text-center">Owner Email</th>
            <th className="px-4 py-2 text-center">Owner ID</th>
            <th className="px-4 py-2 text-center">Verified</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {owners.map(owner => (
            <tr key={owner.id} className="border-t">
              <td className="px-4 py-2 text-center">{owner.id}</td>
              <td className="px-4 py-2 text-center">{owner.restaurantId}</td>
              <td className="px-4 py-2 text-center">{owner.ownerUsername}</td>
              <td className="px-4 py-2 text-center">{owner.restaurantName}</td>
              <td className="px-4 py-2 text-center">{owner.ownerEmail}</td>

              <td className="px-4 py-2 text-center">{owner.ownerId}</td>
              <td className="px-4 py-2 text-center">{owner.isVerified ? 'Yes' : 'No'}</td>
              <td className="px-4 py-2 text-center">
                <button
                  className={`px-4 py-2 rounded ${owner.isVerified ? 'bg-red-500' : 'bg-green-500'} text-white`}
                  onClick={() => handleVerificationToggle(owner)}
                >
                  {owner.isVerified ? 'Unverify' : 'Verify'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OwnersPage;
