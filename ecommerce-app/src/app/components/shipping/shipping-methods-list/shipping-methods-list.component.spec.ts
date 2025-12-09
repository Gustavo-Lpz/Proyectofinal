import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingMethodsListComponent } from './shipping-methods-list.component';

describe('ShippingMethodsListComponent', () => {
  let component: ShippingMethodsListComponent;
  let fixture: ComponentFixture<ShippingMethodsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingMethodsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingMethodsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
