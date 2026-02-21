import { Component, inject } from '@angular/core';
import { PaymentsSignal } from '../../service/payments-signal';

@Component({
  selector: 'app-payments',
  imports: [],
  templateUrl: './payments.html',
  styleUrl: './payments.css',
})
export default class Payments {
  public paymentsSignal = inject(PaymentsSignal);

  constructor() {
    this.paymentsSignal.loadUserPayments();
  }
}
