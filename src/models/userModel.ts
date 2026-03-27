import usersData from "../data/users";
import { User, CreateUserDTO, UpdateUserDTO } from "../types/user";

let nextId: number = usersData.reduce((max, u) => Math.max(max, u.id), 0) + 1;

export function getAll(role?: string): User[] {
  if (role) {
    return usersData.filter((u) => u.role === role);
  }
  return [...usersData];
}

export function getById(id: number): User | undefined {
  return usersData.find((u) => u.id === id);
}

export function emailExists(email: string, excludeId?: number): boolean {
  return usersData.some(
    (u) => u.email === email && u.id !== excludeId
  );
}

export function create(data: CreateUserDTO): User {
  const newUser: User = {
    id: nextId++,
    name: data.name,
    email: data.email,
    role: data.role ?? "user",
    createdAt: new Date().toISOString().split("T")[0], // YYYY-MM-DD
  };
  usersData.push(newUser);
  return newUser;
}

export function update(id: number, data: UpdateUserDTO): User | undefined {
  const index = usersData.findIndex((u) => u.id === id);
  if (index === -1) return undefined;

  usersData[index] = {
    ...usersData[index],
    ...data,
    id: usersData[index].id,
    createdAt: usersData[index].createdAt,
  };

  return usersData[index];
}

export function remove(id: number): boolean {
  const index = usersData.findIndex((u) => u.id === id);
  if (index === -1) return false;
  usersData.splice(index, 1);
  return true;
}
