import { Component, OnInit } from '@angular/core';
import { CitaMedica } from '../interfaces/medicamento.interface';
import { debounceTime } from 'rxjs/operators';
import { HistoriaClinicaComponent } from '../historia-clinica/historia-clinica.component';
import { ReactiveFormsModule, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { firstValueFrom } from 'rxjs';
import { UtilitiesServiceService } from '../services/utilities.service';
@Component({
  selector: 'app-citas-medicas',
  standalone: true,
  imports: [HistoriaClinicaComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './citas-medicas.component.html',
  styleUrl: './citas-medicas.component.css'
})
export class CitasMedicasComponent implements OnInit {
  citas: CitaMedica[] = [];
  citasFiltradas: CitaMedica[] = [];
  mostrarHistoria: boolean = false;
  pacienteSeleccionadoId: string | null = null;
  citaSeleccionada: CitaMedica | null = null;
  filtrosForm: FormGroup;
  pageSize: number = 15;
  currentPage: number = 1;

  columnas = [
    { key: 'fecha', label: 'Fecha' },
    { key: 'hora', label: 'Hora' },
    { key: 'tipoCita', label: 'Tipo Cita' },
    { key: 'servicio', label: 'Servicio' },
    { key: 'cedulaPaciente', label: 'Cédula' },
    { key: 'nombrePaciente', label: 'Nombre' },
    { key: 'codPlan', label: 'Cod. Plan' },
    { key: 'legalizacion', label: 'Legalización' },
    { key: 'pago', label: 'Pago' },
    { key: 'prestamo', label: 'Prestamo' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private utilitiesService: UtilitiesServiceService
  ) {
    this.filtrosForm = this.fb.group({});
    this.columnas.forEach(columna => {
      this.filtrosForm.addControl(columna.key, this.fb.control(''));
    });
  }

  async ngOnInit() {
    await this.loadCitasMedicas();
    this.configurarFiltros();
  }

  getFormControl(key: string): FormControl {
    return this.filtrosForm.get(key) as FormControl;
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
    }
  }

  async loadCitasMedicas() {
    this.utilitiesService.loading = true;
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        this.utilitiesService.loading = false;
        this.utilitiesService.showError('Error en la llamada al servicio:', 'No se encontró el token');
        $('.btn-modal-error').click();
        console.error('No se encontró el token');
        return;
      }
      this.utilitiesService.loading = false;
      const response = await firstValueFrom(this.authService.obtenerCitasMedicas(token));
      this.citas = Array.isArray(response) ? response : [response];
      this.citasFiltradas = [...this.citas];
    } catch (error) {
      this.utilitiesService.loading = false;
      this.utilitiesService.showError('Error al cargar citas:', error as string);
      $('.btn-modal-error').click();
      console.error('Error al cargar citas:', error);
      this.citas = [];
      this.citasFiltradas = [];
    }
  }

  configurarFiltros() {
    this.filtrosForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.aplicarFiltros());
  }

  aplicarFiltros() {
    this.citasFiltradas = this.citas.filter(cita => {
      return this.columnas.every(columna => {
        const filterValue = this.filtrosForm.get(columna.key)?.value?.toLowerCase();
        if (!filterValue) return true;
        
        const citaValue = String(cita[columna.key as keyof CitaMedica] || '')?.toLowerCase();
        return citaValue.includes(filterValue);
      });
    });
  }
  
  verHistoriaClinica(cita: CitaMedica) {
    this.pacienteSeleccionadoId = cita.cedulaPaciente || null; // Asegurar que sea string | null
    this.mostrarHistoria = true;
    this.citaSeleccionada = cita;
  }

  cerrarHistoriaClinica() {
    this.mostrarHistoria = false;
    this.pacienteSeleccionadoId = null;
    this.citaSeleccionada = null; // Limpiar la cita seleccionada al cerrar
  }

  get visibleItems() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.citasFiltradas.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.citasFiltradas.length / this.pageSize);
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

  getVisiblePages(): number[] {
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(this.currentPage - halfVisible, 1);
    let end = Math.min(start + maxVisiblePages - 1, this.totalPages);
    
    if (end === this.totalPages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }
    
    return Array.from({length: end - start + 1}, (_, i) => start + i);
  }
}
