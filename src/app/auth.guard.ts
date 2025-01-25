import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Verificar si el usuario está autenticado (token válido)
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar el rol del usuario
    const userRole = this.authService.getUserRole();
    // Obtener el rol requerido desde la ruta
    const requiredRole = route.data['role'];


    // Validar si el usuario tiene el rol requerido
    if (requiredRole && userRole !== requiredRole) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}
