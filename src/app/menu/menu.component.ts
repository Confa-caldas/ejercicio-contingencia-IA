import { Component,  OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { ModalMessagesComponent } from '../modal-messages/modal-messages.component';
import { HospitalarioComponent } from '../hospitalario/hospitalario.component';
import { AmbulatorioComponent } from '../ambulatorio/ambulatorio.component';
import { UtilitiesServiceService } from '../services/utilities.service';
import { Subscription } from 'rxjs';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterOutlet, ModalMessagesComponent, HospitalarioComponent, AmbulatorioComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit, OnDestroy {
  componenteActual: string = 'bienvenida'; 
  isSidebarVisible: boolean = true;
  nombreUsuario: string = '';
  private nombreUsuarioSubscription: Subscription;
  private inactivitySubscription: Subscription;

  constructor(
    private router: Router,
    private utilitiesService: UtilitiesServiceService
  ) {
    this.nombreUsuarioSubscription = this.utilitiesService.nombreUsuario$.subscribe(
      nombre => {
        this.nombreUsuario = nombre;
      }
    );

    // Inicializar la suscripción de inactividad
    this.inactivitySubscription = this.utilitiesService.inactivitySubject.subscribe(
      (expired: boolean) => {
        if (expired) {
          this.mostrarModalInactividad();
        }
      }
    );
  }

  ngOnInit() {
    // Código existente de inicialización
    this.nombreUsuario = this.utilitiesService.getNombreUsuario() || '';
    this.utilitiesService.nombreUsuario$.subscribe(
      nombre => this.nombreUsuario = nombre
    );

    // Iniciar el control de inactividad
    this.utilitiesService.startTimer();
    this.utilitiesService.setActivityListeners();
    this.utilitiesService.setupVisibilityChangeListener();
  }

  ngOnDestroy() {
    // Limpiar suscripciones y detener el timer
    if (this.inactivitySubscription) {
      this.inactivitySubscription.unsubscribe();
    }
    this.utilitiesService.stopTimer();
  
    // Limpiar elementos del modal
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
    document.body.classList.remove('modal-open');
    document.body.removeAttribute('style');
  }

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

  mostrarModalInactividad() {
    this.utilitiesService.logout();
    const modalButton = document.querySelector('.btn-modal-inactividad') as HTMLButtonElement;
    if (modalButton) {
      modalButton.click();
    }
  }

  cerrarModalYRedirigir() {
    // Obtener el modal y su backdrop
    const modal = document.getElementById('modalInactividad');
    const backdrop = document.querySelector('.modal-backdrop');
    
    if (modal) {
      // Obtener la instancia del modal
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
        
        // Esperar a que termine la animación del modal
        modal.addEventListener('hidden.bs.modal', () => {
          // Remover la clase modal-open del body
          document.body.classList.remove('modal-open');
          
          // Remover el backdrop
          if (backdrop) {
            backdrop.remove();
          }
          
          // Remover cualquier estilo inline que Bootstrap haya agregado al body
          document.body.removeAttribute('style');
          
          // Limpiar el loading y redirigir
          this.utilitiesService.loading = false;
          this.router.navigate(['/login']).then(() => {
            // Forzar un reload después de la navegación
            window.location.reload();
          });
        });
      }
    } else {
      // Si por alguna razón no se encuentra el modal, asegurarse de limpiar todo
      document.body.classList.remove('modal-open');
      if (backdrop) {
        backdrop.remove();
      }
      document.body.removeAttribute('style');
      this.utilitiesService.loading = false;
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
    }
  }
}
