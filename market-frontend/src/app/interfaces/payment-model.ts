export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  method: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
  createdAt: string;
  updatedAt: string;

  order?: {
    id: string;
    code: string;
    total: number;
  };
}