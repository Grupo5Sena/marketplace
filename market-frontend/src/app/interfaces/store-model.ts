export interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  isActive: boolean;
  createdAt: string;
}