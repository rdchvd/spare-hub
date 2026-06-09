// Mirrors the Django OpenAPI schema (Spare Hub backend).

export type Role = "seller" | "buyer" | "admin";

export type User = {
  id: number;
  email: string;
};

export type UserProfile = {
  id: number;
  first_name: string;
  last_name: string;
  role: Role;
  user: User;
};

export type TokenPair = {
  access: string;
  refresh: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: Role;
};

export type LoginInput = {
  email: string;
  password: string;
};
