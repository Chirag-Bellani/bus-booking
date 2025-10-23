import axios from "axios";
import { BASE_URL } from "./config";
import { getAccessToken,getRefreshToken,setAccessToken } from "./storage";


const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 403 ) {
            const refreshToken = getRefreshToken();
            if (refreshToken) {
                try {
                    const response = await axios.post(`${BASE_URL}/user/refresf`, {
                        refreshToken: refreshToken,
                    });
                    const newAccessToken = response.data.accessToken;
                    setAccessToken(newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(originalRequest)
                } catch (err) {
                    return Promise.reject(err);
                }
            }
            else{
                return Promise.reject(error)
            }
        }
        return Promise.reject(error)
    }

            
);
export default apiClient;