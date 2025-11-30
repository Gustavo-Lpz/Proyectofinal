import { TestBed } from '@angular/core/testing';

import { shippingAddressService } from './shipping-address.service';

describe('ShippingAddressService', () => {
  let service: shippingAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(shippingAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
