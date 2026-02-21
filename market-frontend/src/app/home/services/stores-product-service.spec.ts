import { TestBed } from '@angular/core/testing';

import { StoresProductService } from './stores-product-service';

describe('StoresProductService', () => {
  let service: StoresProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoresProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
