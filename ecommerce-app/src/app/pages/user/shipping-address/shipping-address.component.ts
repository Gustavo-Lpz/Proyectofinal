import { Component, OnInit } from "@angular/core";
import { ShippingMethodsListComponent } from "../../../components/shipping/shipping-methods-list/shipping-methods-list.component";
import { ShippingMethodsFormComponent } from "../../../components/shipping/shipping-methods-form/shipping-methods-form.component";
import { ShippingAddressService } from "../../../core/services/shippingAddress/shipping-address.service";
import { Observable, of } from "rxjs";
import { ShippingAddress } from "../../../core/types/shippingAddress";
import { AsyncPipe } from "@angular/common";

@Component({
selector: 'app-shipping-address',
standalone: true,
imports:[ShippingMethodsListComponent, ShippingMethodsFormComponent, AsyncPipe],
templateUrl: './shipping-address.component.html',
styleUrl: './shipping-address.component.css'
})
export class ShippingAddressComponent implements OnInit{
 addressMethods$: Observable<ShippingAddress[]> = of([]);
 selectAddressMethod: ShippingAddress | null = null;
 isEditing: boolean = false;

 constructor(private shippingService: ShippingAddressService){}

  ngOnInit(): void {
    this.addressMethods$ = this.shippingService.shippingAddresses$;
  }

  onEdit(address: ShippingAddress){
    this.selectAddressMethod = address;
    this.isEditing = true;
  }

  onDelete(id: string){
    if(confirm('Estás seguro de eliminar esta Direccion de envio?')){
      this.shippingService.deleteShippingAddress(id).subscribe();
    }
  }

  onAddNew(){
    this.selectAddressMethod = null;
    this.isEditing =  false;
  }

  onAddressSaved(payload: ShippingAddress){
    if (this.isEditing){
      this.shippingService.editShippingAddress(payload).subscribe(() =>{
        this.onAddNew();
      });
    } else {
      this.shippingService.addShippingAddress(payload).subscribe(() =>{
        this.onAddNew
      })
    }
  }
 
}