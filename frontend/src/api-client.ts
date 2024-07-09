import { RegisterFormData } from './pages/Register';
import { SignInFormData } from './pages/SignIn';
import { HotelSearchResponse, HotelType } from '../../backend/src/shared/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  let body;
  try {
    body = await response.json();
  } catch (error) {
    throw new Error('Failed to parse response JSON');
  }

  if (!response.ok) {
    throw new Error(body?.message || 'Registration failed');
  }

  return body;
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  console.log('Sign in form data:', formData);
  console.log('Sign in response:', response);

  let body;
  try {
    body = await response.json();
  } catch (error) {
    throw new Error('Failed to parse response JSON');
  }

  if (!response.ok) {
    throw new Error(body?.message || 'Error during sign in');
  }

  return body;
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error during sign out');
  }
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Token invalid');
  }

  return response.json();
};

export const addMyHotel = async (hotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: 'POST',
    credentials: 'include',
    body: hotelFormData,
  });
  if (!response.ok) {
    throw new Error('Failed to add hotel');
  }

  return response.json();
};

export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error fetching hotels');
  }

  return response.json();
};

export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Error fetching hotel');
  }

  return response.json();
};

export const updateMyHotelById = async (hotelFormData: FormData): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelFormData.get('hotelId')}`, {
    method: 'PUT',
    body: hotelFormData,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to update hotel');
  }

  return response.json();
};

export type SearchParams ={
  destination?: string,
  checkIn?: string,
  checkOut?: string,
  adultCount?: string,
  childCount?: string,
  page?: string,
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOptions?: string;
};

export const searchHotels = async (
  searchParams: SearchParams
): Promise<HotelSearchResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("destination", searchParams.destination || "");
  queryParams.append("checkIn", searchParams.checkIn || ""); 
  queryParams.append("checkOut", searchParams.checkOut || "");
  queryParams.append("adultCount", searchParams.adultCount || ""); 
  queryParams.append("childCount", searchParams.childCount || ""); 
  queryParams.append("page",  searchParams.page || "");

  queryParams.append("maxPrice",  searchParams.maxPrice || "");
  queryParams.append("sortOptions",  searchParams.sortOptions || "");

  searchParams.facilities?.forEach((facility) =>  
    queryParams.append("facilities", facility));

  searchParams.stars?.forEach((star) => 
    queryParams.append("stars", star));

  searchParams.types?.forEach((type) =>  
    queryParams.append("types", type));
  
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/search?${queryParams}`
  );

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return response.json();
};
