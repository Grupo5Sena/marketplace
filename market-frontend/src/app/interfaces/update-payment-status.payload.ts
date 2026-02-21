export interface UpdatePaymentStatusPayload {
  status: 'PENDING' | 'PAID' | 'FAILED';
}