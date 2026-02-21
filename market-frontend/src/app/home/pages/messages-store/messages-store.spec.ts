import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesStore } from './messages-store';

describe('MessagesStore', () => {
  let component: MessagesStore;
  let fixture: ComponentFixture<MessagesStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesStore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
