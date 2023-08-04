import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-validate-register',
  templateUrl: './validate-register.component.html',
  styleUrls: ['./validate-register.component.css'],
})

export class ValidateRegisterComponent implements OnInit {
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  // Función que se ejecuta al iniciar y obtiene el token
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];

      // Si el token existe se ejecuta la funcion verifyEmail y se le pasa el token como parametro
      if (token) {
        this.verifyEmail(token);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  // Función para verificar correo eléctronico luego de registrarse
  async verifyEmail(token: string) {
    try {
      // Solicitud post que verifica el correo eléctronico de una cuenta
      const response = await this.http.get<any>(`http://3.136.197.252:3000/api/verify-email?token=${token}`).toPromise();
    } catch (error) {
      this.router.navigate(['/']);
    }
  }
}