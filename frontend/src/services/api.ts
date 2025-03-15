import axios from 'axios';

// Create an axios instance with base URL
const api = axios.create({
  // Use relative URL in development, which will be proxied
  baseURL: 'https://backend-image-manager-1.onrender.com/api',
  // For production, you might want to use environment variables
  // baseURL: import.meta.env.PROD ? 'https://backend-image-manager-1.onrender.com/' : '/api',
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to process S3 URLs and map field names
api.interceptors.response.use(
  (response) => {
    // Log the response for debugging
    
    // If the response contains image data with S3 URLs
    if (response.data && response.data.images && Array.isArray(response.data.images)) {
      // Map the backend field names to match your frontend Image type
      response.data = response.data.images.map((item: {
        id: number | string;
        s3_url: string;
        original_filename?: string;
        ai_description?: string;
        user_id: number | string;
        uploaded_at: string;
      }) => ({
        id: String(item.id), // Convert to string if your type expects string IDs
        url: item.s3_url,
        title: item.original_filename || 'Untitled',
        description: item.ai_description || '',
        userId: String(item.user_id),
        createdAt: item.uploaded_at
      }));
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default api; 