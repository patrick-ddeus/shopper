import { TableProduct } from "../App";
import { RequestProduct } from "../types/Product";
import api from "./api";

export function getProducts(url: string, query?: Record<string, string>) {
  const searchParams = new URLSearchParams(query);

  return api.get<RequestProduct>(url, searchParams.toString());
}

export function getOneProduct(url: string) {
  return api.get<RequestProduct>(url);
}

export function sendAndValidate<T>(url: string, body: T) {
  return api.post<TableProduct[], T>(url, undefined, body);
}

export function putProduct<T>(url: string, body: T) {
  return api.put<TableProduct[], T>(url, undefined, body);
}
