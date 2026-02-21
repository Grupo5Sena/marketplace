import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnsStore } from './returns-store';

describe('ReturnsStore', () => {
  let component: ReturnsStore;
  let fixture: ComponentFixture<ReturnsStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnsStore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnsStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
