import { inject, Injectable, signal } from "@angular/core";
import { Payment } from "../../interfaces/payment-model";
import { PaymentService } from "./payment-service";

@Injectable({ providedIn: 'root' })
export class PaymentsSignal {
  public payments = signal<Payment[]>([]);
  public loading = signal(false);

  private paymentsSvc = inject(PaymentService);

  loadUserPayments() {
    this.loading.set(true);
    this.paymentsSvc.listUserPayments().subscribe({
      next: payments => {
        this.payments.set(payments);
        this.loading.set(false);
      },
      error: () => {
        this.payments.set([]);
        this.loading.set(false);
      }
    });
  }
}