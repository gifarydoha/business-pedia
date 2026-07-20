export type UserRole = "admin" | "editor" | "author" | "reviewer" | "reader";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  created_at: string;
}

export interface AuthTokenPayload {
  token: string;
  expires_at: string;
  user: User;
}
