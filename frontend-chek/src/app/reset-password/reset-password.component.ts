import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})

export class ResetPasswordComponent implements OnInit {
  // Variables para almacenar datos ingresados por el usuario y preestablecidos
  token: string = '';
  password: string = '';
  validatePassword: string = '';
  passwordMatch: boolean = false;
  resetStatus: string = '';
  hidePassword: boolean = true;
  showPasswordIcon: string = '../../assets/eye.svg';
  showValidatePasswordIcon: string = '../../assets/eye.svg';
  hideValidatePassword: boolean = true;
  showAlert: boolean = false;
  alertType: 'success' | 'error' = 'success';
  alertMessage: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  // Función que se ejecuta al iniciar y obtiene el token
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
    });
  }

  // Función con validaciones y solicitudes para cambiar la clave
  async resetPassword() {
    if (this.token && this.password && this.validatePassword) {
      if (this.password.length !== 4 || this.validatePassword.length !== 4) {
        this.showAlertMessage('La clave debe contener 4 dígitos.', 'error');
      } else if (this.password !== this.validatePassword) {
        this.showAlertMessage('Las claves no coinciden.', 'error');
      } else {
        const resetData = { token: this.token, password: this.password };
        try {
          // Solicitud post para cambiar clave. Se envia tanto la password como el token obtenido al principio
          await this.http.post('http://18.117.159.180:3000/api/change-password', resetData).toPromise();
          this.showAlertMessage('Clave restablecida exitosamente.', 'success');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        } catch (error) {
          this.showAlertMessage('Error al restablecer la clave.', 'error');
        }
      }
    } else {
      this.showAlertMessage('Hay uno o más campos que están vacios.', 'error');
    }
  }

  // Función para controlar la entrada del primer input de clave y asegurarse de que solo tenga 4 dígitos
  onPasswordInput(event: any) {
    const passwordValue = event.target.value;
    event.target.value = passwordValue.replace(/\D/g, '').slice(0, 4);
    this.password = event.target.value;
    this.checkPasswordMatch();
  }

  // Función para controlar la entrada del input de confirmación de clave y asegurarse de que solo tenga 4 dígitos
  onValidatePasswordInput(event: any) {
    const validatePasswordValue = event.target.value;
    event.target.value = validatePasswordValue.replace(/\D/g, '').slice(0, 4);
    this.validatePassword = event.target.value;
    this.checkPasswordMatch();
  }

  // Función que compara que las claves sean iguales
  checkPasswordMatch() {
    this.passwordMatch = this.password === this.validatePassword;
  }

  //Funciones para poder ocultar y visualizar las claves en el formulario de registro
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
    this.showPasswordIcon = this.hidePassword ? '../../assets/eye.svg' : '../../assets/eye-slash.svg';
  }

  toggleValidatePasswordVisibility() {
    this.hideValidatePassword = !this.hideValidatePassword;
    this.showValidatePasswordIcon = this.hideValidatePassword ? '../../assets/eye.svg' : '../../assets/eye-slash.svg';
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
}