import axios, { AxiosError } from 'axios';

// Get base URL from environment variable, default to http://localhost:8080
const rawBaseURL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');

// Standardize base URL: if baseURL already ends with /api, remove it so that endpoints using /api/... remain consistent
const baseURL = rawBaseURL.endsWith('/api') ? rawBaseURL.slice(0, -4) : rawBaseURL;

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    let errorMessage = 'Une erreur réseau est survenue lors de la communication avec le serveur.';
    
    if (error.response) {
      // Server responded with an error status code
      errorMessage = error.response.data?.message 
        || error.response.data?.error 
        || `Erreur ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'Impossible de contacter l\'API Spring Boot sur ' + baseURL + '. Vérifiez que le serveur est démarré.';
    } else {
      errorMessage = error.message || errorMessage;
    }

    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: errorMessage,
    });

    return Promise.reject(new Error(errorMessage));
  }
);
