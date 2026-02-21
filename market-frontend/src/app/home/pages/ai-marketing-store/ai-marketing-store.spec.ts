import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiMarketingStore } from './ai-marketing-store';

describe('AiMarketingStore', () => {
  let component: AiMarketingStore;
  let fixture: ComponentFixture<AiMarketingStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiMarketingStore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiMarketingStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
