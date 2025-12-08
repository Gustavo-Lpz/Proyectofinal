import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ShippingAddressService } from '../../../core/services/shippingAddress/shipping-address.service';
import { ShippingAddress } from "../../../core/types/shippingAddress";
import { CommonModule } from '@angular/common';

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

    this.shippingAddressService.AddShippingAddress(payload).subscribe(() => {
      this.form.reset({
        country: 'México',
        addressType: 'home',
        isDefault: false
      });
    });
  }
}
