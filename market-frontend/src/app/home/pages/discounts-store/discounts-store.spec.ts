import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountsStore } from './discounts-store';

describe('DiscountsStore', () => {
  let component: DiscountsStore;
  let fixture: ComponentFixture<DiscountsStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountsStore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountsStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
