import axios from "axios";
import type { ApiItemResponse, ApiListResponse, CreateUserDTO, UpdateUserDTO, User } from "../types/user";

const api = axios.create({
  baseURL: "/api",
});

export const userService = {
  getAll: () => api.get<ApiListResponse<User>>("/users"),
  getById: (id: string) => api.get<ApiItemResponse<User>>(`/users/${id}`),
  create: (data: CreateUserDTO) => api.post<ApiItemResponse<User>>("/users", data),
  update: (id: string, data: UpdateUserDTO) => api.put<ApiItemResponse<User>>(`/users/${id}`, data),
  remove: (id: string) => api.delete<void>(`/users/${id}`),
};

