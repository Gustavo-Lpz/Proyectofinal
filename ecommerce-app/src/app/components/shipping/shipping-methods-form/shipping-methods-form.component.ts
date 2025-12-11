import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ShippingAddress } from '../../../core/types/shippingAddress';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../shared/form-field/form-field.component';
import { FormErrorService } from '../../../core/services/validation/form-error.service';

@Component({
  selector: 'app-shipping-methods-form',
  imports: [ReactiveFormsModule, FormFieldComponent],
  templateUrl: './shipping-methods-form.component.html',
  styleUrl: './shipping-methods-form.component.css'
})
export class ShippingMethodsFormComponent implements OnChanges {
  @Input() address: ShippingAddress | null = null;
  @Input() isEditMode: boolean = false;
  @Output() addressSaved = new EventEmitter<ShippingAddress>

  addressTypes = [
    {value:'home', label:'Casa'}, 
    {value:'work', label:'Trabajo'}, 
    {value:'other', label:'Otro'}
  ]

  addressForm: FormGroup;

  private formErrorService = inject(FormErrorService);

  constructor(private fb: FormBuilder) {
    this.addressForm = this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['address']) {
      if (this.address) {
        this.populateForm();
        this.addressForm.get('addressType')?.disable();
      } else {
        this.addressForm.reset();
        this.addressForm.patchValue({ addressType: '' });
        this.addressForm.get('addressType')?.enable();
      }
    }
  }

  createForm() {
    return this.fb.group({
      addressType: ['', [Validators.required]],
      name: [''],
      address: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      country: [''],
      phone: [''],
    });
  }

  private populateForm(): void {
    if (!this.address) return;
    this.addressForm.patchValue({
      addressType: this.address.addressType || '',
      name: this.address.name || '',
      address: this.address.address || '',
      city: this.address.city || '',
      state: this.address.state || '',
      postalCode: this.address.postalCode || '',
      country: this.address.country || '',
      phone: this.address.phone || '',
    })
  }

  getFieldError(fieldName: string): string {
    const customLabels = {
      addressType: 'Tipo de direccion',
      name: 'Nombre de la direccion',
      address: 'Direcion de envio',
      city: 'Ciudad',
      state: 'estado',
      postalCode: 'Codigo Postal',
      country: 'Pais',
      phone: 'Numero de telefono',
    };

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
    };
    this.addressForm.reset()
    this.addressSaved.emit(formData);
  }

}

