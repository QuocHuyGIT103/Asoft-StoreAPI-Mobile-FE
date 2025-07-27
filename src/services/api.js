import axios from "axios";

// Thay đổi URL này thành địa chỉ API backend của bạn
// Sử dụng HTTP với port 5000 để match với backend config
const BASE_URL = "http://172.20.10.9:5000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
