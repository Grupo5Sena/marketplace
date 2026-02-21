import { inject, Injectable } from '@angular/core';
import { CreatePaymentPayload } from '../../interfaces/create-payment.payload';
import { Api } from '../../core/services/api';
import { Observable } from 'rxjs';
import { Payment } from '../../interfaces/payment-model';
import { UpdatePaymentStatusPayload } from '../../interfaces/update-payment-status.payload';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private api = inject(Api);

  createPayment(payload: CreatePaymentPayload): Observable<Payment> {
    return this.api.post<Payment>('/payments', payload);
  }

  listUserPayments(): Observable<Payment[]> {
    return this.api.get<Payment[]>('/payments/me');
  }

  listAllPayments(): Observable<Payment[]> {
    return this.api.get<Payment[]>('/payments/all');
  }

  updatePaymentStatus(
    paymentId: string,
    payload: UpdatePaymentStatusPayload
  ): Observable<Payment> {
    return this.api.patch<Payment>(
      `/payments/${paymentId}/status`,
      payload
    );
  }  
}
