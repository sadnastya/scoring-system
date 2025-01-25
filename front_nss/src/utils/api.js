import axios from "axios";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

const api = axios.create({
  baseURL: "http://90.156.156.3:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Ошибка сети. Проверьте подключение к интернету.");
    } else if (error.response.status === 401) {
      console.error("Ошибка авторизации: Токен истёк или недействителен.");

      localStorage.removeItem("token");

      
      history.push("/signin");
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export { history };
export default api;
