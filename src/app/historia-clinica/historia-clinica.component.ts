import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistoriaClinica } from '../interfaces/medicamento.interface';

@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [],
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css'
})
export class HistoriaClinicaComponent implements OnChanges {
  @Input() pacienteId: string | null = null;
  historias: HistoriaClinica[] = [];
  historiaSeleccionada: HistoriaClinica | null = null;
  pageSize: number = 15;
  currentPage: number = 1;

  constructor(private route: ActivatedRoute) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pacienteId'] && this.pacienteId) {
      this.cargarHistoriaClinica(this.pacienteId);
    }
  }

  cargarHistoriaClinica(id: string) {
    // Aquí va la lógica para cargar la historia clínica
    console.log('Cargando historia clínica del paciente:', id);
    this.historias = [
      {
        id: 1,
        fecha: '2024-03-20 09:30',
        medico: 'Dr. Juan Pérez',
        especialidad: 'Medicina General',
        plantilla: 'Consulta General',
        atencion: 'Ambulatoria',
        detalles: {
          motivo: 'Dolor de cabeza y fiebre',
          diagnostico: 'Migraña',
          tratamiento: 'Acetaminofén 500mg cada 8 horas',
          observaciones: 'Paciente presenta síntomas desde hace 2 días'
        }
      },
      // ... más historias
    ];
  }

  verDetalle(historia: HistoriaClinica) {
    this.historiaSeleccionada = this.historiaSeleccionada?.id === historia.id ? null : historia;
  }

  get visibleItems() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.historias.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.historias.length / this.pageSize);
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
