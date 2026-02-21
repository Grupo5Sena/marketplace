import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsStore } from './payments-store';

describe('PaymentsStore', () => {
  let component: PaymentsStore;
  let fixture: ComponentFixture<PaymentsStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsStore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
