import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaingsStore } from './campaings-store';

describe('CampaingsStore', () => {
  let component: CampaingsStore;
  let fixture: ComponentFixture<CampaingsStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaingsStore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaingsStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
