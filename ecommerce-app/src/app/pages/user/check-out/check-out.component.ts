import { Component, computed, OnInit, signal } from '@angular/core';
import { Cart } from '../../../core/types/Cart';
import { Observable, of, take } from 'rxjs';
import { PaymentMethod } from '../../../core/types/PaymentMethod';
import { CartService } from '../../../core/services/cart/cart.service';
import { PaymentService } from '../../../core/services/paymentMethods/payment-methods.service';
import { Store } from '@ngrx/store';
import { OrderService } from '../../../core/services/order/order.service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast/toast.service';
import { selectUserId } from '../../../core/store/auth/auth.selectors';
import { Order } from '../../../core/types/Order';
import { PaymentMethodsListComponent } from "../../../components/payment/payment-methods-list/payment-methods-list.component";
import { CurrencyPipe } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { ShippingMethodsListComponent } from '../../../components/shipping/shipping-methods-list/shipping-methods-list.component';
import { ShippingAddress } from '../../../core/types/shippingAddress';
import { ShippingAddressService } from '../../../core/services/shippingAddress/shipping-address.service';



@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [PaymentMethodsListComponent, RouterLink, CurrencyPipe, AsyncPipe, ShippingMethodsListComponent],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css'
})
export class CheckOutComponent implements OnInit {

  cartSig = signal<Cart | null>(null);
  loading = signal(false);
  errorMsg = signal<string | null>(null);

  paymentMethod$: Observable<PaymentMethod[]> = of([]);
  paymentMethodId: string = '';
  shippingAddress$: Observable<ShippingAddress[]> = of([]);
  shippingMethodId: string = '';
  

  total = computed(() =>
    this.cartSig()?.products.reduce((acc, p) => acc + p.product.price * p.quantity, 0) || 0
  );

  constructor(
    private paymentService: PaymentService,
    private cartService: CartService,
    private store: Store,
    private orderservice: OrderService,
    private router: Router,
    private toast: ToastService,
    private shippingAddress : ShippingAddressService 
  
  ) {}

  ngOnInit(): void {
    const userId = this.getUserId();
    if (!userId) return;
    this.cartService.cart$.subscribe(cart => this.cartSig.set(cart));
    this.paymentService.loadPayMethods();
    this.paymentMethod$ = this.paymentService.paymetMethods$;
    this.shippingAddress.loadShippingAddresses();
    this.shippingAddress$ = this.shippingAddress.shippingAddresses$;
  }

  onPaymentMethodSelected(id: string) {
    this.paymentMethodId = id;
  }

  onShippingAddressSelected(id: string) {
    this.shippingMethodId = id;
  }

 submitOrder() {
  const cart = this.cartSig();
  const userId = this.getUserId();

  if (!cart || !userId) return;

  this.loading.set(true);

  const orderPayload: Order = {
    user: userId,
    products: cart.products.map(p => ({
      productId: p.product._id,
      quantity: p.quantity,
      price: p.product.price
    })),
    totalPrice: this.total(),
    status: 'pending',

    // FIXES:
    shippingAddress: this.shippingMethodId,
    paymentMethod: this.paymentMethodId,

    shippingCost: 0,
  };

  this.orderservice.createOrder(orderPayload).subscribe({
    next: () => {
      this.cartService.clearCart().subscribe(() => {
        this.cartSig.set(null);
        this.loading.set(false);
        this.router.navigateByUrl('/thank-you-page');
      });
    },
    error: (error) => {
      this.loading.set(false);
      console.log(error);
      this.errorMsg.set('There was an error processing your order. Please try again.');
    }
  });
}
  getUserId() {
    let id = '';
    this.store
      .select(selectUserId)
      .pipe(take(1))
      .subscribe((userId) => (id = userId ?? ''));
    return id;
  }
}
