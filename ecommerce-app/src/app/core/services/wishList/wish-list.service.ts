import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
  WishListSchema,
  WishList,
} from '../../types/WishList';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  private http = inject(HttpClient);

  private baseUrl = `${environment.BACK_URL}/wishlist`;

  // -----------------------------
  // Obtener wishlist del usuario
  // -----------------------------
  getWishList(userId: string): Observable<WishList> {
    return this.http.get(`${this.baseUrl}/${userId}`).pipe(
      map((data) => {
        const parsed = WishListSchema.safeParse(data);
        if (!parsed.success) {
          console.error('Error validando wishlist:', parsed.error);
          throw new Error('Error parsing WishList data');
        }
        return parsed.data;
      })
    );
  }

  // -----------------------------
  // Agregar un producto a wishlist
  // -----------------------------
  addProduct(userId: string, productId: string): Observable<WishList> {
    return this.http
      .post(`${this.baseUrl}/${userId}/add`, { productId })
      .pipe(
        map((data) => {
          const parsed = WishListSchema.safeParse(data);
          if (!parsed.success) {
            console.error('Error validando respuesta al agregar producto:', parsed.error);
            throw new Error('Error parsing WishList data');
          }
          return parsed.data;
        })
      );
  }

  // -----------------------------
  // Eliminar un producto
  // -----------------------------
  removeProduct(userId: string, productId: string): Observable<WishList> {
    return this.http
      .delete(`${this.baseUrl}/${userId}/remove/${productId}`)
      .pipe(
        map((data) => {
          const parsed = WishListSchema.safeParse(data);
          if (!parsed.success) {
            console.error('Error validando respuesta al eliminar producto:', parsed.error);
            throw new Error('Error parsing WishList data');
          }
          return parsed.data;
        })
      );
  }

  // -----------------------------
  // Vaciar la wishlist
  // -----------------------------
  clearWishList(userId: string): Observable<WishList> {
    return this.http
      .delete(`${this.baseUrl}/${userId}/clear`)
      .pipe(
        map((data) => {
          const parsed = WishListSchema.safeParse(data);
          if (!parsed.success) {
            console.error('Error validando respuesta al limpiar wishlist:', parsed.error);
            throw new Error('Error parsing WishList data');
          }
          return parsed.data;
        })
      );
  }
}
