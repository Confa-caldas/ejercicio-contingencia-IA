import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { ModalMessagesComponent } from '../modal-messages/modal-messages.component';
import { HospitalarioComponent } from '../hospitalario/hospitalario.component';
import { AmbulatorioComponent } from '../ambulatorio/ambulatorio.component';
import { UtilitiesServiceService } from '../services/utilities.service';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterOutlet, ModalMessagesComponent, HospitalarioComponent, AmbulatorioComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  componenteActual: string = 'bienvenida'; 
  isSidebarVisible: boolean = true;

  constructor(private router: Router, private utilitiesService: UtilitiesServiceService) {}

  navigateTo(componente: string): void {
    this.componenteActual = componente;
  }

  cerrarSesion(): void {
    // Aquí puedes agregar la lógica para limpiar el localStorage o sessionStorage si los usas
    this.utilitiesService.logout();
    // Redirigir al login
    this.router.navigate(['/login']);
  }

  toggleMenu(): void {
    document.getElementById('wrapper')?.classList.toggle('toggled');
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
