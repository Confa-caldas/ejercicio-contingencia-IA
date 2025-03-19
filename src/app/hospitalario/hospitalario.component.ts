import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Paciente } from '../interfaces/paciente.interface';
import { HistoriaClinicaComponent } from '../historia-clinica/historia-clinica.component';
import { ModalMessagesComponent } from '../modal-messages/modal-messages.component';
import { MedicamentosComponent } from '../medicamentos/medicamentos.component';
import { AuthenticationService } from '../services/authentication.service';
import { UtilitiesServiceService } from '../services/utilities.service';
import { HistoriaClinica, DetalleHistoriaClinica } from '../interfaces/medicamento.interface';

@Component({
  selector: 'app-hospitalario',
  standalone: true,
  imports: [FormsModule, HistoriaClinicaComponent, MedicamentosComponent, ModalMessagesComponent, CommonModule],
  templateUrl: './hospitalario.component.html',
  styleUrl: './hospitalario.component.css'
})
export class HospitalarioComponent implements OnInit {

  sabs: string[] = [];
  sabSeleccionado: string = '';
  pacientes: Paciente[] = [];
  mostrarHistoriaClinica: boolean = false;
  pacienteSeleccionado: Paciente | null = null;
  pacienteActual: string | null = null;
  mostrarMedicamentos: boolean = false;
  pageSize: number = 15; // tamaño de página
  currentPage: number = 1; // página actual
  historiasClinicas: HistoriaClinica[] = [];

  constructor(
    private utilitiesService: UtilitiesServiceService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.utilitiesService.loading = true;
    this.verificarTokenYCargarSabs();
  }

  verificarTokenYCargarSabs() {
    if (!this.utilitiesService.isAuthenticated()) {
      this.utilitiesService.loading = false;
      this.utilitiesService.showError('¡Ten presente!', 'No se encontró token');
      $('.btn-modal-error').click();
      this.router.navigate(['/login']);
      return;
    }

    const token = localStorage.getItem('authToken');
    this.authService.obtenerSab(token!).subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.sabs = response.map(item => item.sab);
          this.utilitiesService.loading = false;
        } else if (this.authService.esTokenInvalido(response)) {
          this.utilitiesService.loading = false;
          this.utilitiesService.showError('¡Ten presente!', 'Token inválido');
          $('.btn-modal-error').click();
          this.router.navigate(['/login']);
        } else {
          this.utilitiesService.loading = false;
          this.utilitiesService.showError('¡Ten presente!', 'Error al cargar los SABs');
          $('.btn-modal-error').click();
        }
      },
      error: (error) => {
        this.utilitiesService.loading = false;
        this.utilitiesService.showError('¡Ten presente!', 'Error al cargar SABs');
        $('.btn-modal-error').click();
        if (error.status === 401) {
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  onSabChange(event: any): void {
    this.utilitiesService.loading = true;
    this.sabSeleccionado = event.target.value;
    if (this.sabSeleccionado) {
      if (!this.utilitiesService.isAuthenticated()) {
        this.utilitiesService.loading = false;
        this.utilitiesService.showError('¡Ten presente!', 'No se encontró token');
        $('.btn-modal-error').click();
        this.router.navigate(['/login']);
        return;
      }

      const token = localStorage.getItem('authToken');
      this.authService.obtenerPacientesSab(this.sabSeleccionado, token!).subscribe({
        next: (response: any) => {
          this.utilitiesService.loading = false;
          const pacientesData = Array.isArray(response) ? response : [response];
          if (pacientesData[0]?.respuesta === "Paciente encontrado") {
            this.pacientes = pacientesData.map(item => ({
              numeroDocumento: item.numeroDocumento || '',
              nombre: item.nombre || '',
              numeroAdmision: item.numeroAdmision || '',
              numeroCama: item.numeroCama || '',
              hcAdicional: item.hcAdicional || '',
              plan: item.plan || '',
              hcAfiliacion: item.hcAfiliacion || '',
              convenio: item.convenio || '',
              codigoSAB: item.codigoSAB || '',
              codigoPlan: item.codigoPlan || '',
              fechaNacimiento: item.fechaNacimiento || '',
              sexo: item.sexo || '',
              tipoDocumento: item.tipoDocumento || ''
            }));
            this.currentPage = 1;
          } else {
            this.pacientes = [];
            this.utilitiesService.loading = false;
            this.utilitiesService.showError('¡Ten presente!', 'No se encontraron pacientes para el SAB seleccionado');
            $('.btn-modal-error').click();
          }
        },
        error: (error) => {
          this.utilitiesService.loading = false;
          this.utilitiesService.showError('¡Ten presente!', 'Error al cargar pacientes');
          $('.btn-modal-error').click();
          this.pacientes = [];
          if (error.status === 401) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
        }
      });
    }
    this.ocultarTodo();
}


  cargarPacientes(): void {
    // Simula datos - Reemplazar con llamada real a tu servicio
    this.pacientes = [
      { numeroDocumento: '1234567890', nombre: 'Juan Pérez', numeroAdmision: 'Afiliación 1', numeroCama: '101' },
      { numeroDocumento: '1234567891', nombre: 'María García', numeroAdmision: 'Afiliación 2', numeroCama: '102' },
      // ... más pacientes
    ];
  }

  verHistoriaClinica(paciente: Paciente) {
    this.pacienteSeleccionado = paciente;
    this.mostrarHistoriaClinica = true;
    this.mostrarMedicamentos = false;
  }


  verMedicamentos(paciente: Paciente) {
    if (this.pacienteSeleccionado?.numeroDocumento === paciente.numeroDocumento && this.mostrarMedicamentos) {
      this.mostrarMedicamentos = false;
      this.pacienteSeleccionado = null;
    } else {
      this.pacienteSeleccionado = paciente;
      this.mostrarMedicamentos = true;
      this.mostrarHistoriaClinica = false;
    }
  }

  ocultarTodo() {
    this.mostrarHistoriaClinica = false;
    this.mostrarMedicamentos = false;
    this.pacienteSeleccionado = null;
  }

  // Método para obtener los pacientes de la página actual
  get paginatedPacientes() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.pacientes.slice(startIndex, startIndex + this.pageSize);
  }
  
  // Método para cambiar de página
  onPageChange(page: number) {
    this.currentPage = page;
  }
  
  get totalPages(): number {
    return Math.ceil(this.pacientes.length / this.pageSize);
  }

  get visiblePacientes() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.pacientes.slice(startIndex, startIndex + this.pageSize);
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  firstPage() {
    this.currentPage = 1;
  }

  lastPage() {
    this.currentPage = this.totalPages;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
