import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  // Variables para almacenar datos ingresados por el usuario y preestablecidos
  email: string = '';
  password: string = '';
  hidePassword: boolean = true;
  showPasswordIcon: string = '../../assets/eye.svg';
  showAlert: boolean = false;
  alertType: 'success' | 'error' = 'success';
  alertMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  // Función con validaciones y solicitudes para poder iniciar sesión
  async login(): Promise<void> {
    if (!this.isValidEmail(this.email)) {
      this.showAlertMessage('Por favor, ingresa un correo electrónico válido.', 'error');
      return;
    }
    else if (this.email && this.password) {
      try {
        // Solicitud post para iniciar sesión, se envia el correo eléctronico y la clave
        const response = await this.http.post<{ token: string }>('http://3.136.197.252:3000/api/login', { email: this.email, password: this.password })
          .pipe(
            map(response => response.token),
            catchError(error => {
              this.showAlertMessage('Inicio de sesión fallido. Por favor, verifique sus credenciales.', 'error');
              return throwError(error);
            })
          )
          .toPromise();
        
        // Si la respuesta existe
        if (response) {
          // Asigna el token utilizando localStorage
          localStorage.setItem('access_token', response);
          //Redirige a la página de Home
          this.router.navigate(['/home']);
        } else {
          this.showAlertMessage('Inicio de sesión fallido. Por favor, verifique sus credenciales.', 'error');
        }
      } catch (error) {
        this.showAlertMessage('Intentelo nuevamente.', 'error');
      }
    } else {
      this.showAlertMessage('Ingrese usuario y/o contraseña válidos.', 'error');
    }
  }

  // Función para verificar si el formato del correo electrónico es válido
  isValidEmail(email: string): boolean {
    const emailCondition = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailCondition.test(email);
  }

  //Funciones para poder ocultar y visualizar la clave en el login
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
    this.showPasswordIcon = this.hidePassword ? '../../assets/eye.svg' : '../../assets/eye-slash.svg';
  }

  onPasswordInput(event: any) {
    const passwordValue = event.target.value;
    event.target.value = passwordValue.replace(/\D/g, '').slice(0, 4);
    this.password = event.target.value;
  }

  // Función para mostrar un mensaje de alerta al usuario
  showAlertMessage(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;

    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

  showAlertGoogleRipley() {
    this.showAlertMessage('Lo sentimos, está opción no está disponible.', 'error');
  }
}