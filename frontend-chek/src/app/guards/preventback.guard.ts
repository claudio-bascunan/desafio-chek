import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PreventBackGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {

    // Obtiene el token almacenado en localStorage
    const accessToken = localStorage.getItem('access_token');

    // Sí el token existe redirige a la página principal tras iniciar sesión, sino no permite el acceso
    if (accessToken) {
      this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }
}