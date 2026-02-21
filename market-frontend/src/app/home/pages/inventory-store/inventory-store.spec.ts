import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryStore } from './inventory-store';

describe('InventoryStore', () => {
  let component: InventoryStore;
  let fixture: ComponentFixture<InventoryStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryStore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
