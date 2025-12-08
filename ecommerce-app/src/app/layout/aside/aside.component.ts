import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { SideMenuComponent } from '../../components/sidebar/side-menu/side-menu.component';
import { routeItem } from '../../components/sidebar/menu-item/menu-item.component';
import { AdminDirective } from '../../core/directives/admin.directive';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectDecodedToken } from '../../core/store/auth/auth.selectors';
import { logout } from '../../core/store/auth/auth.actions';
import { decodedToken } from '../../core/types/Token';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [CommonModule, SideMenuComponent, AdminDirective],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
})
export class AsideComponent implements OnInit {
  sideBarOpen: boolean = false;

  routes: routeItem[] = [
    { title: 'Inicio', route: '', textColor: 'text-green-200' },
    { title: 'Productos', route: '/products', textColor: 'text-green-200' },
    { title: 'Categorias', route: '/categories', textColor: 'text-green-200' },
  ];

  adminRoutes: routeItem[] = [
    { title: 'Productos', route: '/admin/products' },
    { title: 'Usuarios', route: '/admin/users' },
    { title: 'Categorias', route: '/admin/categories' },
    { title: 'Compras', route: '/admin/purchases' },
  ];

  authRoutes: routeItem[] = [
    { title: 'Mi Perfil', route: '/user', textColor: 'text-blue-500' },
    { title: 'Mi Carrito', route: '/user/cart', textColor: 'text-blue-500'},
    { title: 'Direcciones de envio', route: '/user/shipping_address', textColor: 'text-blue-500' },
    { title: 'Metodos de pago', route: '/user/paymentmethods', textColor: 'text-blue-500' },
    { title: 'Lista de deseos', route: '/user/wishlist', textColor: 'text-blue-500' },
  ];

  notAuthRoutes: routeItem[] = [
    { title: 'Iniciar Sesion', route: '/login', textColor: 'text-blue-500' },
    { title: 'Registro', route: '/register', textColor: 'text-blue-500' },
  ];
  user$: Observable<decodedToken | null> = of(null);

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.user$ = this.store.select(selectDecodedToken);
  }
  
  logout(){
    this.store.dispatch(logout());
  }
}
