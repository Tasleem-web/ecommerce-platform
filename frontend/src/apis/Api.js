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
      };
    }
    return config;
  });
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

const ApiProfiles = axios.create({
  baseURL: "http://localhost:4003"
});

attachAuthInterceptor(Api);
attachAuthInterceptor(ApiUsers);
attachAuthInterceptor(ApiProducts);
attachAuthInterceptor(ApiProfiles);

export { Api, ApiProducts, ApiUsers, ApiProfiles };