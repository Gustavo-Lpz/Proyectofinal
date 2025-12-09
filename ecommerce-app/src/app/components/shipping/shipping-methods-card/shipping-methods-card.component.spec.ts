import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingMethodsCardComponent } from './shipping-methods-card.component';

describe('ShippingMethodsCardComponent', () => {
  let component: ShippingMethodsCardComponent;
  let fixture: ComponentFixture<ShippingMethodsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingMethodsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingMethodsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
