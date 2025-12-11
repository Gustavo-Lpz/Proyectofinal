import { Component, OnInit } from '@angular/core';
import { Product } from '../../core/types/Products';
import { ProductsService } from '../../core/services/products/products.service';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { WishListService } from '../../core/services/wishList/wish-list.service';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../core/store/auth/auth.selectors';
import { take } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private cartService: CartService,   // <-- INYECTAR SERVICIO
    private wishListService: WishListService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');
        if (!id) return;

        this.productService.getProductByID(id).subscribe({
          next: (product) => {
            this.product = product;
          },
          error: () => {
            this.product = null;
          },
        });
      },
    });
  }

  // 🔥 MÉTODO PARA AGREGAR AL CARRITO
  addToCart(): void {
    if (!this.product) return;

    this.cartService.addToCart(this.product._id, 1).subscribe();
  }

  getUserId(): Promise<string> {
  return new Promise((resolve) => {
    this.store.select(selectUserId).pipe(take(1)).subscribe(id => {
      resolve(id ?? '');
    });
  });
}

// ❤️ Agregar a Wishlist
async addToWishList() {
  if (!this.product) return;

  const userId = await this.getUserId();
  if (!userId) {
    console.error("No hay usuario logueado");
    return;
  }

  this.wishListService
    .addProduct(userId, this.product._id)
    .pipe(take(1))
    .subscribe({
      next: () => {
        console.log("Producto agregado a wishlist");
      },
      error: (err) => {
        console.error("Error agregando a wishlist", err);
      }
    });
}

}

