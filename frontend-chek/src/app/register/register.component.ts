import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface RegisterUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  validatePassword: string;
  birthdate: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Variables para almacenar datos ingresados por el usuario y preestablecidos
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  password: string = '';
  validatePassword: string = '';
  passwordMatch: boolean = false;
  birthdate: string = '';
  passwordPattern: RegExp = /^\d{4}$/;
  hidePassword: boolean = true;
  showPasswordIcon: string = '../../assets/eye.svg';
  showValidatePasswordIcon: string = '../../assets/eye.svg';
  hideValidatePassword: boolean = true;
  showInfoMessage: boolean = false;
  showAlert: boolean = false;
  alertType: 'success' | 'error' = 'success';
  alertMessage: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  // Función con validaciones y solicitudes para registrar usuarios
  async registerUser() {
    if (!this.validateForm()) {
      return;
    }

    const user: RegisterUser = {
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      password: this.password,
      validatePassword: this.validatePassword,
      birthdate: this.birthdate
    };

    try {
      // Solicitud post para registrar usuario. Se envian todos los datos de usuario
      await this.http.post<any>('http://18.117.159.180:3000/api/register', user).toPromise();
      this.showAlertMessage('Cuenta creada exitosamente! Verifica tu correo electrónico para activar tu cuenta.', 'error');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 5000);
      
    } catch (error: any) {
      this.showAlertMessage(error.error.message, 'error');
    }
  }

  // Función para validar los input del formulario de registro y mostrar mensajes de alerta en caso de ser necesario
  validateForm(): boolean {
    if (
      this.firstname.trim() === '' ||
      this.lastname.trim() === '' ||
      this.email.trim() === '' ||
      this.password.trim() === '' ||
      this.validatePassword.trim() === '' ||
      this.birthdate.trim() === ''
    ) {
      this.showAlertMessage('Todos los campos son obligatorios', 'error');
      return false;
    }

    if (this.firstname.length > 20) {
      this.showAlertMessage('El nombre supera el limite de caracteres.', 'error');
      return false;
    }

    if (this.lastname.length > 20) {
      this.showAlertMessage('El apellido supera el limite de caracteres.', 'error');
      return false;
    }

    if (!this.isValidDate(this.birthdate)) {
      this.showAlertMessage('Fecha de nacimiento inválida. El formato debe ser yyyy-mm-dd. Ejemplo: 2000-02-21', 'error');
      return false;
    }

    if (!this.email.includes('@') || !this.email.includes('.')) {
      this.showAlertMessage('El correo electrónico no es válido', 'error');
      return false;
    }

    if (!this.passwordPattern.test(this.password)) {
      this.showAlertMessage('La clave debe contener 4 dígitos.', 'error');
      return false;
    }

    if (this.password !== this.validatePassword) {
      this.showAlertMessage('Las contraseñas no coinciden', 'error');
      return false;
    }

    return true;
  }

  // Función para verificar que la fecha de nacimiento ingresada por el usuario este en formato yyyy-mm-dd
  isValidDate(dateString: string): boolean {
    const regexDate = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexDate.test(dateString)) return false;
    const date = new Date(dateString);
    return date.toISOString().slice(0, 10) === dateString;
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