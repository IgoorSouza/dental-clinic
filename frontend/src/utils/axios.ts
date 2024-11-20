import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL!,
});

api.interceptors.request.use((request) => {
  if (!request.url!.includes("/auth")) {
    const { accessToken } = JSON.parse(localStorage.getItem("authData")!);
    request.headers.Authorization = `Bearer ${accessToken}`;
  }

  return request;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("authData");
      window.location.href = "/auth";
    }

    return Promise.reject(error);
  }
);
