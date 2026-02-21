import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarStore } from './sidebar-store';

describe('SidebarStore', () => {
  let component: SidebarStore;
  let fixture: ComponentFixture<SidebarStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarStore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
