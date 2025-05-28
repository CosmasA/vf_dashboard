// token.js

// Save token to localStorage
export const setToken = (newToken) => {
  localStorage.setItem("Token", newToken); // Store token in localStorage
};

// Retrieve token from localStorage
export const getToken = () => {
  return localStorage.getItem("Token"); // Get token from localStorage
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem("Token"); // Remove token from localStorage
};

// Check if the user is authenticated (i.e., a token exists)
export const isAuthenticated = () => {
  return !!getToken(); // Return true if a token exists, otherwise false
};
