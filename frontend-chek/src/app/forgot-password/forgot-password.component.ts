import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})

export class ForgotPasswordComponent {

  // Variables para almacenar datos ingresados por el usuario y preestablecidos
  email: string = '';
  resetStatus: string = '';
  showAlert: boolean = false;
  alertType: 'success' | 'error' = 'success';
  alertMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  // Función para enviar el correo de recuperación de contraseña al servidor
  async sendRecovery(): Promise<void> {
    if (!this.isValidEmail(this.email)) {
      this.showAlertMessage('Por favor, ingresa un correo electrónico válido.', 'error');
      return;
    }

    const resetData = { email: this.email };

    try {
      // Solicitud post al servidor para enviar el correo de recuperación
      const response = await this.http.post<any>('http://localhost:3000/api/reset-password', resetData).toPromise();
      this.showAlertMessage(`Se ha enviado un correo electrónico a ${this.email} para restablecer la clave.`, 'success');

      // Tiempo: 5 segundos
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 5000);
    } catch (error) {
      this.showAlertMessage('Ha ocurrido un problema al enviar el correo electrónico.', 'error');
    }
  }

  // Función para verificar si el formato del correo electrónico es válido
  isValidEmail(email: string): boolean {
    const emailCondition = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailCondition.test(email);
  }

  // Función para mostrar un mensaje de alerta al usuario
  showAlertMessage(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
  }
}