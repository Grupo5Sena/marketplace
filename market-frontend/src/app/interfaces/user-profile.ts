export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: 'ADMIN' | 'SELLER' | 'USER';
  avatar?: string;
  phone?: string;
  createdAt?: string;
  store?: { id: string; name: string; slug: string };
}
