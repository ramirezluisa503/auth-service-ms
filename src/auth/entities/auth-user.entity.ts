export interface AuthUser {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'staff' | 'patient';
  isActive: boolean;
  createdAt: string;
}
