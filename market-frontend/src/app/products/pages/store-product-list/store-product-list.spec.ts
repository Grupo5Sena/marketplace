import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreProductList } from './store-product-list';

describe('StoreProductList', () => {
  let component: StoreProductList;
  let fixture: ComponentFixture<StoreProductList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreProductList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreProductList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
