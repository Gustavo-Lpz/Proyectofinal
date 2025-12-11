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

  // -------------------------------------
  // Obtener wishlist basada en token
  // -------------------------------------
  getWishList(): Observable<WishList> {
    return this.http.get(`${this.baseUrl}`).pipe(
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

  // -------------------------------------
  // Agregar producto a wishlist
  // -------------------------------------
addProduct(productId: string): Observable<WishList> {
  return this.http
    .post(`${this.baseUrl}/add`, { productId })
    .pipe(
      map((data) => {
        const parsed = WishListSchema.safeParse(data);
        if (!parsed.success) {
          console.error(
            'Error validando respuesta al agregar producto:',
            parsed.error
          );
          throw new Error('Error parsing WishList data');
        }
        return parsed.data;
      })
    );
}

  // -------------------------------------
  // Eliminar producto de wishlist
  // -------------------------------------
  removeProduct(productId: string): Observable<WishList> {
    return this.http
      .delete(`${this.baseUrl}/remove/${productId}`)
      .pipe(
        map((data) => {
          const parsed = WishListSchema.safeParse(data);
          if (!parsed.success) {
            console.error(
              'Error validando respuesta al eliminar producto:',
              parsed.error
            );
            throw new Error('Error parsing WishList data');
          }
          return parsed.data;
        })
      );
  }

  // -------------------------------------
  // Limpiar wishlist
  // -------------------------------------
  clearWishList(): Observable<WishList> {
    return this.http.delete(`${this.baseUrl}/clear`).pipe(
      map((data) => {
        const parsed = WishListSchema.safeParse(data);
        if (!parsed.success) {
          console.error(
            'Error validando respuesta al limpiar wishlist:',
            parsed.error
          );
          throw new Error('Error parsing WishList data');
        }
        return parsed.data;
      })
    );
  }
}
