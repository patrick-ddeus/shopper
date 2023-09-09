import axios, { AxiosResponse } from "axios";

const verbs = ["get", "post", "put", "delete"];

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

interface ApiEndPoints {
  get: <T>(route: string, query?: string) => Promise<T | T[]>;
  post: <T, K>(route: string, query?: string, body?: K) => Promise<T>;
  put: <T, K>(route: string, query?: string, body?: K) => Promise<T>;
  delete: <T>(route: string, query?: string) => Promise<T>;
}

const api = {} as ApiEndPoints;

verbs.forEach((method) => {
  (api as ApiEndPoints)[method as keyof ApiEndPoints] = async function <T, K>(
    route: string,
    query?: string,
    body?: K
  ) {
    const url = `${route}?${query}`;

    const response = await axiosInstance.request<T, AxiosResponse<T>>({
      url: query ? url : route,
      method,
      data: body,
    });

    return response.data;
  };
});

export default api;
