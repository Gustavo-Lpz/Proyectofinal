import { Component, OnInit } from "@angular/core";
import { Observable, of, take } from "rxjs";
import { WishListService } from "../../../core/services/wishList/wish-list.service";
import { WishList } from "../../../core/types/WishList";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: "app-wish-list",
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: "./wish-list.component.html",
})
export class WishListComponent implements OnInit {
  wishList$: Observable<WishList | null> = of(null);
  loading = true;

  constructor(private wishListService: WishListService) {}

  ngOnInit(): void {
    this.loadUserWishList();
  }

  loadUserWishList() {
    this.loading = true;
    const userId = localStorage.getItem('userId') || '';
    this.wishListService.getWishList(userId).pipe(take(1)).subscribe({
      next: (wishList) => {
        this.wishList$ = of(wishList);
        this.loading = false;
      },
      error: () => {
        this.wishList$ = of(null);
        this.loading = false;
      }
    });
  }

  removeFromWishList(productId: string) {
    const userId = localStorage.getItem('userId') || '';
    this.wishListService.removeFromWishList(productId).subscribe(() => {
      this.loadUserWishList();
    });
  }

  clearWishList() {
    this.wishListService.clearWishList().subscribe(() => {
      this.loadUserWishList();
    });
  } 
}