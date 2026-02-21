export interface CreatePaymentPayload {
  orderId: string;
  amount: number;
  method: string;
}
