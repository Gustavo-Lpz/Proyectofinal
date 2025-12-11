import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingMethodsFormComponent } from './shipping-methods-form.component';

describe('ShippingMethodsFormComponent', () => {
  let component: ShippingMethodsFormComponent;
  let fixture: ComponentFixture<ShippingMethodsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingMethodsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingMethodsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
