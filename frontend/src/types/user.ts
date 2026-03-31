export type UserRole = "admin" | "user";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type CreateUserDTO = {
  name: string;
  email: string;
  role: UserRole;
};

export type UpdateUserDTO = Partial<CreateUserDTO>;

export type ApiListResponse<T> = {
  success: boolean;
  count?: number;
  data: T[];
  message?: string;
};

export type ApiItemResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

