export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Image {
  id: string;
  url: string;
  title: string;
  description?: string;
  userId: string;
  createdAt: string;
}

export interface AuthFormData {
  username: string;
  password: string;
  email?: string;
} 