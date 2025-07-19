// Configuration des endpoints API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com' 
  : 'http://localhost:5000';

export const API_ENDPOINTS = {
  USERS: '/api/users',
  CATEGORIES: '/api/categories',
  GOUVERNORATS: '/api/gouvernorats',
  DELEGATIONS: '/api/delegations'
};

// Helper function pour faire des appels API avec gestion d'erreur
export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

export default { API_ENDPOINTS, apiCall };
