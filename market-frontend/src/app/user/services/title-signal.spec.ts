import { TestBed } from '@angular/core/testing';

import { TitleSignal } from './title-signal';

describe('TitleSignal', () => {
  let service: TitleSignal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TitleSignal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
