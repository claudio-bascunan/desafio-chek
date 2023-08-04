import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  /* Función que se ejecuta cuando se intenta acceder a una ruta protegida.
  Verifica si el usuario tiene un token de acceso válido en el LocalStorage */
  canActivate(): boolean {

    // Obtiene el token almacenado en localStorage
    const accessToken = localStorage.getItem('access_token');

    // Si tiene el token puede acceder a las ruta, sino se redirige al login
    if (accessToken) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}