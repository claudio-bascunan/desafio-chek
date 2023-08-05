import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

interface LogData {
  date_time: string;
  status: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  // Variables para almacenar datos ingresados por el usuario y preestablecidos
  firstname: string | null = null;
  logs: LogData[] = [];
  private sessionTimeout = 5 * 60 * 1000; // Tiempo: 5 minutos
  private timeoutId: any;
  private isPageReloading = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  constructor(private router: Router) {}

  // Función que se ejecuta al iniciar el componente
  ngOnInit(): void {

    // Detecta cuando se cierra una pagina o se recarga
    window.addEventListener('unload', () => {
      if (!this.isPageReloading) {
        this.logout();
      }
    });

    // Detecta cuando se presiona una tecla
    window.addEventListener('keydown', (event) => {
      if (event.key === 'F5') {
        this.isPageReloading = true;
      }
      this.onActivity();
    });

    // Detecta cuando se hace clic
    window.addEventListener('click', () => {
      this.onActivity();
    });

    // Obtiene el token almacenado en localStorage
    const token = localStorage.getItem('access_token');

    // Si el token tiene valor 'true' va a extraer su información, en este caso el Nombre (firstname) y el historial de acceso (logs)
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      this.firstname = tokenData.firstname;
      this.logs = tokenData.logs || [];
    }

    this.calculateTotalPages();
    this.startSessionTimeout();
  }

  // Función para cerrar sesión
  logout(): void {
  
    // Elimina el token de localStorage
    localStorage.removeItem('access_token');

    //Redirige al login
    this.router.navigate(['/login']);
  }

  // Función que se ejecuta si el usuario está activo
  onActivity(): void {
    clearTimeout(this.timeoutId);
    this.startSessionTimeout();
  }

  // Función que inicia tiempo para cerrar sesión en caso de inactividad
  startSessionTimeout(): void {
    this.timeoutId = setTimeout(() => this.logout(), this.sessionTimeout);
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.logs.length / this.pageSize);
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
    }
  }

  getPaginatedLogs(): LogData[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.logs.slice(startIndex, endIndex);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return formatDate(date, 'yyyy-MM-dd HH:mm:ss', 'en-US'); // Formato deseado
  }
}