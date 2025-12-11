import { Component, OnInit, inject } from '@angular/core';
import { WishListService } from '../../../core/services/wishList/wish-list.service';
import { WishList } from '../../../core/types/WishList';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit {

  private wishService = inject(WishListService);

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
}
