export interface RoleItem {
  role_name: string;
  role_alias: string;
  role_parent_name: string;
}

export type RoleAlias = "super-admin" | "admin" | "committee-member" | "reviewer" | "author" | "default-user" | "reader";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: RoleItem[];
  avatar?: string;
  emailVerified: boolean;
  isDefaultPassword: boolean;
  createdAt: string;
}

export interface AuthTokenPayload {
  token: string;
  expires_at: string;
  user: User;
}
