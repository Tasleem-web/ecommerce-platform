import axios from "axios";

const getStoredToken = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const fromStorage = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  if (fromStorage) {
    return fromStorage;
  }

  const match = document.cookie.match(/(?:^|;\s*)authToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
};

const attachAuthInterceptor = (apiInstance) => {
  apiInstance.interceptors.request.use((config) => {
    const token = getStoredToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      };
    }
    return config;
  });
};

// Track if session expired modal is already shown to avoid duplicates
let sessionExpiredFired = false;

const attachResponseInterceptor = (apiInstance) => {
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401 && !sessionExpiredFired) {
        sessionExpiredFired = true;
        // Dispatch custom event for the App component to catch
        window.dispatchEvent(new CustomEvent('session-expired'));
      }
      return Promise.reject(error);
    }
  );
};

const Api = axios.create({
  baseURL: "http://localhost:3000"
});

const ApiUsers = axios.create({
  baseURL: "http://localhost:4001",
  withCredentials: true
});

const ApiProducts = axios.create({
  baseURL: "http://localhost:4002"
});

const ApiCart = axios.create({
  baseURL: "http://localhost:4003"
});

const ApiWishlist = axios.create({
  baseURL: "http://localhost:4004"
});

attachAuthInterceptor(Api);
attachAuthInterceptor(ApiUsers);
attachAuthInterceptor(ApiProducts);
attachAuthInterceptor(ApiCart);
attachAuthInterceptor(ApiWishlist);

attachResponseInterceptor(Api);
attachResponseInterceptor(ApiUsers);
attachResponseInterceptor(ApiProducts);
attachResponseInterceptor(ApiCart);
attachResponseInterceptor(ApiWishlist);

export { Api, ApiProducts, ApiUsers, ApiCart, ApiWishlist };
