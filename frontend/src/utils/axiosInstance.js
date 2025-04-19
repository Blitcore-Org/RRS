import axios from 'axios';

// Create an Axios instance with credentials so cookies are sent automatically.
const axiosInstance = axios.create({
  baseURL: '', // Set your API base URL if needed
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

// Function to process the failed queue once the token is refreshed.
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If the request returns a 401 (unauthorized) and it hasn't already been retried:
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue any other failed requests during the refresh process.
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call your refresh endpoint
        const refreshResponse = await axiosInstance.post('/api/auth/refresh');
        // Optionally, if you want to update axios defaults with the new token,
        // you could do that here, but since the token is stored as an httpOnly cookie,
        // subsequent requests will automatically include it.
        processQueue(null, refreshResponse.data.accessToken);
        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
       console.log('Refresh token error:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
