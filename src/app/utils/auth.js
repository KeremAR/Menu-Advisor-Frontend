// utils/auth.js

import {jwtDecode} from 'jwt-decode';
import { setCookie, getCookie } from 'cookies-next';

export const authenticateUser = async (email, password) => {
  try {
    const response = await fetch('https://menuadv.azurewebsites.net/api/Account/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      setCookie("token", JSON.stringify(data?.data));
      return data;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed. Please check your credentials.');
    }
  } catch (error) {
    throw new Error('An unexpected error occurred. Please try again later.');
  }
};

export const getUserRoles = (token) => {
  const decodedToken = jwtDecode(token);
  return decodedToken.roles;
};

export const getTokenFromCookie = () => {
  const currentCookie = getCookie("token");
  return JSON.parse(currentCookie);
};

export const fetchRestaurantOwnerDetails = async (token) => {
  const response = await fetch('https://menuadv.azurewebsites.net/api/v1/RestaurantOwner', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error('Failed to fetch restaurant owner details.');
  }
};
export const fetchByRestaurantOwnerId = async (ownerId) => {
  try {
    const response = await fetch(`https://menuadv.azurewebsites.net/api/v1/RestaurantOwner?OwnerId=${ownerId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch restaurant owner by ID.');
    }
    const data = await response.json();
    console.log('Owner detailsINAUTH:', data);
    return data;
  } catch (error) {
    throw new Error(error.message || 'An unexpected error occurred while fetching restaurant owner by ID.');
  }
};



// New function to get the authenticated user's restaurant ID
export const getAuthenticatedUserRestaurantId = async () => {
  const token = getTokenFromCookie();
  const restaurantOwnerDetails = await fetchRestaurantOwnerDetails(token.jwToken);
  const userRestaurantId = restaurantOwnerDetails.data[0]?.restaurantId;
  return userRestaurantId;
};
