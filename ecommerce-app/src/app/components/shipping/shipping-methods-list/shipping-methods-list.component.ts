import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShippingAddress } from '../../../core/types/shippingAddress';
import { ShippingMethodsCardComponent } from '../shipping-methods-card/shipping-methods-card.component';

@Component({
  selector: 'app-shipping-methods-list',
  imports: [ShippingMethodsCardComponent],
  templateUrl: './shipping-methods-list.component.html',
  styleUrl: './shipping-methods-list.component.css'
})
export class ShippingMethodsListComponent {
  @Input() shippingMethods: ShippingAddress[] = [];
  @Input() isEditable: boolean = false; 
  @Input() isSelectable: boolean = false;
  @Input() selectedId: string | null = null;

  @Output() edit = new EventEmitter<ShippingAddress>();
  @Output() delete = new EventEmitter<string>();
  @Output() select = new EventEmitter<string>();

    onEdit(address: ShippingAddress) {
      this.edit.emit(address);
    }
  
    onDelete(id: string) {
      this.delete.emit(id);
    }
  
    onSelect(id: string) {
      this.select.emit(id);
    }

}
