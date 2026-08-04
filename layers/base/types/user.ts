export type UserRole = "admin" | "editor" | "author" | "reviewer" | "reader";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthTokenPayload {
  token: string;
  expires_at: string;
  user: User;
}
