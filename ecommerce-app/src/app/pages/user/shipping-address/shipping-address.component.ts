import { Component, OnInit } from "@angular/core";
import { ShippingMethodsListComponent } from "../../../components/shipping/shipping-methods-list/shipping-methods-list.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ShippingAddressService } from '../../../core/services/shippingAddress/shipping-address.service';
import { ShippingAddress as ShippingAddressc } from "../../../core/types/shippingAddress";
import { CommonModule } from '@angular/common';
import { Observable, of } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { ShippingAddressComponent as ShippingAddressComponentC } from "../../../components/shipping/shipping-address/shipping-address.component";

@Component({
  selector: 'app-shipping-address',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.css']
})
export class ShippingAddressComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private shippingAddressService: ShippingAddressService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['México'],
      phone: ['', Validators.required],
      addressType: ['home'],
      isDefault: [false]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value;

    this.shippingAddressService.addShippingAddress(payload).subscribe(() => {
      this.form.reset({
        country: 'México',
        addressType: 'home',
        isDefault: false
      });
    });
  }
}