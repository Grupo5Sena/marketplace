import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceLayout } from './marketplace-layout';

describe('MarketplaceLayout', () => {
  let component: MarketplaceLayout;
  let fixture: ComponentFixture<MarketplaceLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketplaceLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketplaceLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
