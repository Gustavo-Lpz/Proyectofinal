import { Injectable } from "@angular/core";
import { 
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
 } from "rxjs";
import { WishList, WishListSchema } from "../../types/WishList";
import { HttpClient } from "@angular/common/http";
import { ToastService } from "../toast/toast.service";
import { Store } from "@ngrx/store";
import { selectUserId } from "../../store/auth/auth.selectors";

@Injectable({
  providedIn: "root",
})
export class WishListService {
  private baseUrl = "http://localhost:3000/api/wish-list";
  private wishListSubject = new BehaviorSubject<WishList | null>(null);
  wishList$ = this.wishListSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private toast: ToastService,
    private store: Store
  ) {
    this.loadUserWishList();
  }

  getUserId(): string {
    let userId: string =''
    this.store.select(selectUserId).pipe(take(1)).subscribe({next:(id)=>userId=id ?? ''})
    return userId
  }

  getWishListByUserId(userId: string): Observable<WishList | null> {
    return this.httpClient.get(`${this.baseUrl}/user/${userId}`).pipe(
      map((data) => {
        const response = WishListSchema.safeParse(data);
        if (!response.success) {
          console.log(response.error);
          throw new Error(`${response.error}`);
        }
        return response.data;
      })
    );
  }

  loadUserWishList() {
    const id = this.getUserId();
    if (!id) {
      this.wishListSubject.next(null);
      return;
    }
        this.getWishListByUserId(id).subscribe({
      next: (wishList)=>{
        this.wishListSubject.next(wishList);
      },
      error: (error)=>{
        this.wishListSubject.next(null);
      }
    })
  }

  addToWishList(productId: string, quantity: number=1):Observable<WishList | null>{
    const userId = this.getUserId();
    if (!userId){
      console.log('No user ID found');
      return of (null);
    }
    const payload = { productId, 
      quantity 
    }
    return this.httpClient.post(`${this.baseUrl}/add-product`, payload).pipe(
      switchMap(()=>this.getWishListByUserId(userId)),
      tap((updateWishList)=>{
        this.toast.success('Producto agregado a la lista de deseos');
        this.wishListSubject.next(updateWishList);
      }),
      catchError((error)=>{
        return of (null);
      })
    )
  }

  removeFromWishList(productId: string): Observable<WishList| null>{
    const userId= this.getUserId();
    if (!userId) {
      console.log('usuario no autentificado');
      return of(null);
    }
    const payload = {
      userId,
      productId
    }
    return this.httpClient.delete(`${this.baseUrl}/remove-product`, {body: payload}).pipe(
      switchMap(()=>this.getWishListByUserId(userId)),
      tap((updatedWishList)=>{
        this.wishListSubject.next(updatedWishList),
        this.toast.success('Producto eliminado de la lista de deseos');
      })
    )
  };

    clearWishList():Observable<WishList | null>{
      const wishListId = this.wishListSubject.value?._id;
      if (!wishListId) {
        return of(null);
      }
      return this.httpClient.delete(`${this.baseUrl}/${wishListId}`).pipe(
        tap(()=>{
          this.wishListSubject.next(null);
          this.toast.success('Lista de deseos eliminada');
        }),
        map(()=>null)
      );
    }

}