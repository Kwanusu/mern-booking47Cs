import { RegisterFormData } from './pages/Register';
import { SignInFormData } from './pages/SignIn';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  let body;
  try {
    body = await response.json();
    console.log(response);
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
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
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
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error('Error during sign out');
  }
};

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token invalid");
  }

  return response.json();
};
