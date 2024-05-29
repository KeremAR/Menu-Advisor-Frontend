import { NextResponse } from 'next/server';
import { getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import { fetchByRestaurantOwnerId } from './app/utils/auth'; // Adjust the path as needed

export async function middleware(req) {
  console.log('Middleware triggered');

  const tokenCookie = getCookie('token', { req });
  console.log('Token Cookie:', tokenCookie);

  if (!tokenCookie) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  const token = JSON.parse(tokenCookie);
  const decodedToken = jwtDecode(token.jwToken);
  const roles = decodedToken.roles || [];
  console.log('Roles:', roles);

  if (roles.includes('SuperAdmin')) {
    return NextResponse.next();
  }

  if (roles.includes('RestaurantOwner')) {
    try {
      const ownerId = decodedToken.uid;
      console.log('Owner ID:', ownerId);
      
      const ownerDetails = await fetchByRestaurantOwnerId(ownerId);
      console.log('Owner Details:', ownerDetails); // Log ownerDetails to inspect its structure
      
      const restaurantId = ownerDetails.data[0].restaurantId; // Access the restaurantId from the first element of the data array
      console.log('Owner\'s Restaurant ID:', restaurantId);

      const urlSegments = req.nextUrl.pathname.split('/');
      const requestedRestaurantId = urlSegments[2]; // Extract the restaurant ID from the URL segments
      console.log('Requested Restaurant ID:', requestedRestaurantId);

      if (String(restaurantId) === requestedRestaurantId) {
        return NextResponse.next();
      } else {
        const url = req.nextUrl.clone();
        url.pathname = `/store/${restaurantId}`;
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('Error fetching restaurant owner details:', error);
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  const url = req.nextUrl.clone();
  url.pathname = '/login';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*', '/store/:path*'],
};
