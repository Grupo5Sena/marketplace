export interface Order {
  id: string;
  code: string;
  userId: string;
  storeId: string;
  items: { productId: string; title: string; price: number; quantity: number }[];
  total: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED' | 'PENDING'; // incluye PENDING si quieres
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  shippingStatus: 'PENDING' | 'SHIPPED' | 'DELIVERED';
  shippingAddress: any;
  billingAddress?: any;
  trackingNumber?: string;
  trackingUrl?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}