import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersStore } from './customers-store';

describe('CustomersStore', () => {
  let component: CustomersStore;
  let fixture: ComponentFixture<CustomersStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersStore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomersStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
