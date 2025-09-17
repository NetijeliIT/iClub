import axios from 'axios';

interface FailedQueueItem {
    resolve: (token: string | null) => void;
    reject: (error: any) => void;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
   // withCredentials: true, // Important: allow sending cookies
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle token refresh on 401
let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is a 401 (Unauthorized) and the request has not been retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            // If a refresh is already in progress, wait for it
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest); // Retry the original request with the new token
                    })
                    .catch((err) => Promise.reject(err)); // Handle refresh token failure
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call your refresh endpoint
                const { data } = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/auth/user/refresh`,
                    {
                        withCredentials: true, // Needed to send the cookie
                    }
                );

                const { accessToken } = data;
                localStorage.setItem('accessToken', accessToken); // Store the new token

                originalRequest.headers.Authorization = `Bearer ${accessToken}`; // Set new token on original request
                processQueue(null, accessToken); // Resolve all failed requests

                return api(originalRequest); // Retry the original request with the new token
            } catch (refreshError) {
                processQueue(refreshError, null); // Reject all failed requests
                localStorage.clear(); // Clear the tokens on failure
                window.location.href = '/login'; // Redirect to login
                return Promise.reject(refreshError); // Reject the current request
            } finally {
                isRefreshing = false;
            }
        }

        // If the error is not a 401, just reject the error
        return Promise.reject(error);
    }
);

export default api;
