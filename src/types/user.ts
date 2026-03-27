export type UserRole = "admin" | "user";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export type CreateUserDTO = {
  name: string;
  email: string;
  role?: UserRole;
};

export type UpdateUserDTO = Partial<Omit<User, "id" | "createdAt">>;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
}
