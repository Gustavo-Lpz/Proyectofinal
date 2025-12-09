import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ShippingAddress } from '../../../core/types/shippingAddress';

@Component({
  selector: 'app-shipping-methods-card',
  imports: [],
  templateUrl: './shipping-methods-card.component.html',
  styleUrl: './shipping-methods-card.component.css'
})
export class ShippingMethodsCardComponent {
  @Input() shippingAddress!: ShippingAddress;
  @Input() isEditable: boolean = false;
  @Input() isSelectable: boolean = false;
  @Input() isSelected: boolean = false;

  @Output() edit = new EventEmitter<ShippingAddress>();
  @Output() delete = new EventEmitter<string>();
  @Output() select = new EventEmitter<string>();  

    onSelectEdit(event: Event) {
    event.stopPropagation();
    this.edit.emit(this.shippingAddress);
  }
  
  onSelectDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.shippingAddress._id);
  }

  onCardClick() {
    if (this.isSelectable) {
      this.select.emit(this.shippingAddress._id);
    }
  }

}
