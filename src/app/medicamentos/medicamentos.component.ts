import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Paciente } from '../interfaces/paciente.interface';
import { Medicamento } from '../interfaces/medicamento.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-medicamentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medicamentos.component.html',
  styleUrl: './medicamentos.component.css'
})
export class MedicamentosComponent implements OnChanges {
  @Input() pacienteId: string | null = null;
  medicamentos: Medicamento[] = [];
  pageSize: number = 15;
  currentPage: number = 1;
  paciente: Paciente = {
    nombre: '',
    tipoDocumento: '',
    numeroDocumento: '',
    fechaNacimiento: '',
    sexo: '',
    codigoSAB: '',
    codigoPlan: '',
    numeroCama: '',
    numeroAdmision: '',
    convenio: ''
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pacienteId'] && this.pacienteId) {
      this.cargarMedicamentos(this.pacienteId);
    }
  }

  cargarMedicamentos(id: string) {
    // Aquí va la lógica para cargar los medicamentos
    console.log('Cargando medicamentos del paciente:', id);
    this.paciente = {
      nombre: 'Juan Pérez',
      tipoDocumento: 'CC',
      numeroDocumento: '1234567890',
      fechaNacimiento: '1990-01-01',
      sexo: 'Masculino',
      codigoSAB: 'SAB1',
      codigoPlan: 'Plan1',
      numeroCama: '101',
      numeroAdmision: 'Afiliación 1',
      convenio: 'Convenio 1'
    };
    this.medicamentos = [
      { nombre: 'Paracetamol', dosis: '100mg', observacion: 'Cada 6 horas', horaAplicacion: '10:00', origen: 'Farmacia', unidadAdministracion: 'ml', viaAdministracion: 'Oral', indicacionEspecial: 'Dolor leve', frecuencia: 'Cada 6 horas', estado: 'Activo' },
      { nombre: 'Omeprazol', dosis: '20mg', observacion: 'Cada 12 horas', horaAplicacion: '12:00', origen: 'Farmacia', unidadAdministracion: 'ml', viaAdministracion: 'Oral', indicacionEspecial: 'Acidez estomacal', frecuencia: 'Cada 12 horas', estado: 'Activo' }
    ];
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
