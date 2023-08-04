import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { PreventBackGuard } from './guards/preventback.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ValidateRegisterComponent } from './validate-register/validate-register.component';

@NgModule({
  imports: [RouterModule.forRoot([
    // Ruta vacia o / redirige al login
    { path: '', redirectTo: '/login', pathMatch: 'full' },

    // Ruta para iniciar sesión
    { path: 'login', component: LoginComponent, canActivate: [PreventBackGuard] },

    // Ruta para crear nueva cuenta
    { path: 'register', component: RegisterComponent, canActivate: [PreventBackGuard]},

    // Ruta para recuperar clave
    { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [PreventBackGuard] },

    // Ruta para restablecer clave
    { path: 'reset-password', component: ResetPasswordComponent },

    // Ruta para validar correo eléctronico de cuenta registrada
    { path: 'validate-register', component: ValidateRegisterComponent },

    // Ruta principal al iniciar sesión
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},

    // Cualquier otra ruta redirige al login
    { path: '**', redirectTo: '/login' }
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }