import { Component, OnInit, inject } from '@angular/core';
import { WishListService } from '../../../core/services/wishList/wish-list.service';
import { WishList } from '../../../core/types/WishList';
import { CartService } from '../../../core/services/cart/cart.service'; // ✅ IMPORTANTE
import { take } from 'rxjs';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {

  private wishService = inject(WishListService);
  private cartService = inject(CartService);  // ✅ INJECTAR CARRITO

  wishlist?: WishList;
  loading = true;

  ngOnInit() {
    this.loadWishList();
  }

  loadWishList() {
    this.loading = true;

    this.wishService.getWishList().subscribe({
      next: (data) => {
        this.wishlist = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading wishlist:', err);
        this.loading = false;
      }
    });
  }

  removeItem(productId: string) {
    this.wishService.removeProduct(productId).subscribe({
      next: (data) => {
        this.wishlist = data;
      },
      error: (err) => console.error(err)
    });
  }

  clearList() {
    this.wishService.clearWishList().subscribe({
      next: (data) => {
        this.wishlist = data;
      },
      error: (err) => console.error(err)
    });
  }

  // ✅ NUEVO: MOVER AL CARRITO
  moveToCart(productId: string) {
    this.cartService.addToCart(productId).pipe(take(1)).subscribe({
      next: () => {
        this.removeItem(productId); // elimina automáticamente de wishlist
        console.log("Producto movido al carrito");
      },
      error: (err) => console.error("Error moviendo al carrito:", err)
    });
  }

}
