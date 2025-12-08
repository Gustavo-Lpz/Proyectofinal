import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
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
 import { ShippingAddress, ShippingAddressArraySchema } from "../../types/shippingAddress";
import { ToastService } from "../toast/toast.service";
import { Store } from "@ngrx/store";
import { selectUserId } from "../../store/auth/auth.selectors";
import { environment } from "../../../../environments/environment"; 

@Injectable({
  providedIn: "root",
})
export class ShippingAddressService {
  private baseUrl = `${environment.BACK_URL}/shipping-address`;
  private shippingAddressSubject = new BehaviorSubject<ShippingAddress | null>(null);
  private shippingAddressListSubject = new BehaviorSubject<ShippingAddress[]>([]);
  shippingAddress$ = this.shippingAddressSubject.asObservable();
  shippingAddresses$ = this.shippingAddressListSubject.asObservable();

  constructor(
    private http: HttpClient,
    private store: Store,
    private toast: ToastService
  ) {
    this.loadShippingAddresses();
  }

  getUserId() {
    let id = '';
    this.store
      .select(selectUserId)
      .pipe(take(1))
      .subscribe((userId) => (id = userId ?? ''));

    return id;
  }

  loadShippingAddresses() {
    const id = this.getUserId();
    console.log('Loading shipping addresses for user ID:', id);
    if (!id) {
      console.log('No user ID found, setting empty array');
      this.shippingAddressListSubject.next([]);
      return;
    }
    this.getShippingAddressByUser(id).subscribe({
      next: (data) => {
        console.log('Shipping addresses loaded:', data);
        this.shippingAddressListSubject.next(data);
      },
      error: (error) => {
        console.error('Error loading shipping addresses:', error);
        this.shippingAddressListSubject.next([]);
      },
    });
  }

getShippingAddressByUser(id: string): Observable<ShippingAddress[]> {
    return this.http.get(`${this.baseUrl}/user/${id}`).pipe(
      map((data) => {
        const response = ShippingAddressArraySchema.safeParse(data);
        if (!response.success) {
          console.log(response.error);
          return [];
        }

        return response.data;
      })
    );
  }

 addShippingAddress(address: ShippingAddress): Observable<ShippingAddress[]> {
    const id = this.getUserId();
    if (!id) {
      return of([]);
    }
    const data = { ...address, userId: id };
    return this.http.post(`${this.baseUrl}`, data).pipe(
      switchMap(() => this.getShippingAddressByUser(id)),
      tap((udatedPayments) => {
        this.toast.success('metodo de pago agregado');
        this.shippingAddressListSubject.next(udatedPayments);
      })
    );
  }

  editShippingAddress( address: ShippingAddress) {
    const id = this.getUserId();
    if (!id) {
      return of([]);
    }
    return this.http.put(`${this.baseUrl}/${address._id}`, address).pipe(
      switchMap(() => this.getShippingAddressByUser(id)),
      tap((updatedAddresses) => {
        this.toast.success('Dirección de envío actualizada');
        this.shippingAddressListSubject.next(updatedAddresses);
      })
    );
  }

  deleteShippingAddress(id: string) {
    const userId = this.getUserId();
    if (!userId) {
      return of([]);
    }
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      switchMap(() => this.getShippingAddressByUser(userId)),
      tap((updatedAddresses) => {
        this.toast.success('Dirección de envío eliminada');
        this.shippingAddressListSubject.next(updatedAddresses);
      })
    );  
  }

}