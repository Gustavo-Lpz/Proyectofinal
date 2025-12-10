import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AddressTypeSchema, ShippingAddress } from '../../../core/types/shippingAddress';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../shared/form-field/form-field.component';
import { FormErrorService } from '../../../core/services/validation/form-error.service';

@Component({
  selector: 'app-shipping-address',
  imports: [ReactiveFormsModule, FormFieldComponent],
  templateUrl: './shipping-address.component.html',
  styleUrl: './shipping-address.component.css'
})
export class ShippingAddressComponent implements OnChanges {
  @Input() address: ShippingAddress | null = null;
  @Input() isEditMode: boolean = false;
  @Output() addressSaved = new EventEmitter<ShippingAddress>

  addressForm: FormGroup;

  private formErrorService = inject(FormErrorService);

  constructor(private fb: FormBuilder) {
    this.addressForm = this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address']) {
      if (this.address) {
        this.populateForm();
        this.addressForm.get('type')?.disable();
      } else {
        this.addressForm.reset();
        this.addressForm.patchValue({ type: '' });
        this.addressForm.get('type')?.enable();
      }
    }
  }

  createForm() {
    return this.fb.group({
      name: [''],
      address: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      country: [''],
      phone: [''],
      addressType: ['']
    });
  }

  private populateForm(): void {
    if (!this.address) return;
    this.addressForm.patchValue({
      name: this.address.name || '',
      address: this.address.address || '',
      city: this.address.city || '',
      state: this.address.state || '',
      postalCode: this.address.postalCode || '',
      country: this.address.country || '',
      phone: this.address.phone || '',
      addressType: this.address.addressType || '',
    })
  }

  getFieldError(fieldName: string) {
    const customLabels = {
      name: 'Nombre de la direccion',
      address: 'Direcion de envio',
      city: 'Ciudad',
      state: 'estado',
      postalCode: 'Codigo Postal',
      country: 'Pais',
      phone: 'Numero de telefono',
      addressType: 'Tipo de direccion'
    }

    return this.formErrorService.getFieldError(this.addressForm, fieldName, customLabels);
  }

  onSubmit(): void {
    if (this.addressForm.invalid) {
      return;
    }

    const form = this.addressForm.value;
    console.log(form)
    const formData: ShippingAddress = {
      _id: this.address?._id ?? '',
      user: this.address?.user ?? '',
      name: form.name || '',
      address:  form.address || '',
      city: form.city || '',
      state: form.state || '',
      postalCode: form.postalCode || '',
      country: form.country || '',
      phone:  form.phone || '',
      addressType: form.addressType || '',
      isDefault: this.address?.isDefault ?? false,
      isActive: this.address?.isActive ?? true,
    };
    this.addressForm.reset()
    this.addressSaved.emit(formData);
  }

}

