import { Component, OnInit } from "@angular/core";
import { Observable,of,take } from "rxjs";
import { WishListService } from "../../../core/services/wishList/wish-list.service";
import { WishList } from "../../../core/types/WishList";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-wish-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./wish-list.component.html",
  styleUrl: "./wish-list.component.css",
})
export class WishListComponent implements OnInit {
  wishList$: Observable<WishList | null> = of(null);
  constructor(private wishListService: WishListService) {}

  ngOnInit(): void {
    this.wishList$ = this.wishListService.wishList$;
  }

  removeFromWishList(productId: string) {
    this.wishListService.removeFromWishList(productId).subscribe();
  }

  clearWishList() {
    this.wishListService.clearWishList().subscribe();
  }
  
}