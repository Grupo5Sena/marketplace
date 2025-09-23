import { UserRole } from '@prisma/client';

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null; 
  createdAt: Date;
}