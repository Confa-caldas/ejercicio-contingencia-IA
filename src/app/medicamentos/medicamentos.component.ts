import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Paciente } from '../interfaces/paciente.interface';
import { Medicamento, MedicamentoResponse } from '../interfaces/medicamento.interface';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { firstValueFrom } from 'rxjs';
import { UtilitiesServiceService } from '../services/utilities.service';

@Component({
  selector: 'app-medicamentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medicamentos.component.html',
  styleUrl: './medicamentos.component.css'
})
export class MedicamentosComponent implements OnChanges {
  @Input() paciente: Paciente | null = null;
  medicamentos: Medicamento[] = [];
  pageSize: number = 15;
  currentPage: number = 1;
  
  constructor(private authService: AuthenticationService, private utilitiesService: UtilitiesServiceService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['paciente'] && this.paciente) {
      this.cargarMedicamentos();
    }
  }

  async cargarMedicamentos() {
    this.utilitiesService.loading = true;
    if (!this.paciente) return;
  
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        this.utilitiesService.loading = false;
        this.utilitiesService.showError('Error al cargar medicamentos:', 'No se encontró el token');
        $('.btn-modal-error').click();
        return;
      }
  
      const response = await firstValueFrom(
        this.authService.obtenerMedicamentos(
          token,
          this.paciente.numeroAdmision || '',
          this.paciente.codigoSAB || ''
        )
      );
  
      // Manejar la respuesta según la estructura correcta
      const medicamentosResponse = response as MedicamentoResponse;
      
      // Actualizar los medicamentos con la lista del response
      if (medicamentosResponse.listMedicamentos && Array.isArray(medicamentosResponse.listMedicamentos)) {
        this.medicamentos = medicamentosResponse.listMedicamentos;
      } else {
        this.medicamentos = [];
      }
      this.utilitiesService.loading = false;
    } catch (error) {
      this.utilitiesService.loading = false;
      this.utilitiesService.showError('Error al cargar medicamentos:', error as string);
      $('.btn-modal-error').click();
      this.medicamentos = [];
    }
  }

  get visibleItems() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.medicamentos.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.medicamentos.length / this.pageSize);
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
