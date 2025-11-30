import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './shipping-address.component.html',
})
export class shippingAddressComponent {

  // Estructura EXACTA que tu API requiere
  address = {
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'México',
    phone: '',
    isDefault: false,
    addressType: 'home'
  };

  // URL BASE de tu API (ajústala según tu backend)
  private baseUrl = 'http://localhost:3000/api/shipping-address';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  guardarDireccion() {
    this.http.post(this.baseUrl, this.address).subscribe({
      next: (res: any) => {
        console.log('Dirección creada:', res);
        alert('Dirección guardada correctamente ✔');

        // Redirección al carrito o donde tú decidas
        this.router.navigate(['/carrito']);
      },
      error: (err) => {
        console.error('Error al guardar dirección', err);
        alert('Hubo un error al guardar la dirección ❌');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/carrito']);
  }
}
