export interface AuthEntity {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}
