import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Request: attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sh_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response: handle 401 refresh
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem("sh_refresh");
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
          localStorage.setItem("sh_token", data.data.accessToken);
          original.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;
