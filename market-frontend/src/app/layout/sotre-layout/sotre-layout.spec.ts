import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SotreLayout } from './sotre-layout';

describe('SotreLayout', () => {
  let component: SotreLayout;
  let fixture: ComponentFixture<SotreLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SotreLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SotreLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
