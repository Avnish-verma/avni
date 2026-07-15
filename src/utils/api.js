// This pulls the URL you set in your .env file
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(endpoint, options = {}) {
  // 1. Get the token from local storage
  const token = localStorage.getItem('avnishstudy_token');

  // 2. Set up headers, automatically adding the token if we have one
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 3. Make the actual request to your backend
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 4. If the backend says "401 Unauthorized", our token is dead. Clear it and force a login.
  if (response.status === 401) {
    localStorage.removeItem('avnishstudy_token');
    window.location.href = '/login'; // Force redirect to login page
    return Promise.reject('Unauthorized');
  }

  // 5. Parse the JSON response
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Return the error message from the backend if something went wrong
    throw new Error(data?.error?.message || 'An unexpected error occurred');
  }

  return data;
}