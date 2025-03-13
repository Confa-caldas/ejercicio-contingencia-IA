import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Paciente } from '../interfaces/paciente.interface';
import { HistoriaClinicaComponent } from '../historia-clinica/historia-clinica.component';
import { MedicamentosComponent } from '../medicamentos/medicamentos.component';

@Component({
  selector: 'app-hospitalario',
  standalone: true,
  imports: [FormsModule, HistoriaClinicaComponent, MedicamentosComponent],
  templateUrl: './hospitalario.component.html',
  styleUrl: './hospitalario.component.css'
})
export class HospitalarioComponent {

  sabs: string[] = ['SAB1', 'SAB2', 'SAB3'];
  sabSeleccionado: string = '';
  pacientes: Paciente[] = [];
  mostrarHistoriaClinica: boolean = false;
  pacienteSeleccionado: string | null = null;
  mostrarMedicamentos: boolean = false;
  pageSize: number = 15; // tamaño de página
  currentPage: number = 1; // página actual

  onSabChange(event: any): void {
    this.sabSeleccionado = event.target.value;
    this.cargarPacientes();
    // Ocultar las secciones al cambiar de SAB
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

  verHistoriaClinica(pacienteId: any): void {
    if (this.pacienteSeleccionado === pacienteId && this.mostrarHistoriaClinica) {
      // Si ya está mostrando la HC del mismo paciente, la oculta
      this.mostrarHistoriaClinica = false;
      this.pacienteSeleccionado = null;
    } else {
      // Muestra la HC del paciente seleccionado
      this.pacienteSeleccionado = pacienteId;
      this.mostrarHistoriaClinica = true;
      this.mostrarMedicamentos = false;
    }
  }

  verMedicamentos(pacienteId: any): void {
    if (this.pacienteSeleccionado === pacienteId && this.mostrarMedicamentos) {
      // Si ya está mostrando los medicamentos del mismo paciente, los oculta
      this.mostrarMedicamentos = false;
      this.pacienteSeleccionado = null;
    } else {
      // Muestra los medicamentos del paciente seleccionado
      this.pacienteSeleccionado = pacienteId;
      this.mostrarMedicamentos = true;
      this.mostrarHistoriaClinica = false;
    }
  }

  ocultarTodo(): void {
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
