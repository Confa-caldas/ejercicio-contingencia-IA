import { Component, OnInit } from '@angular/core';
import { CitaMedica } from '../interfaces/medicamento.interface';
import { debounceTime } from 'rxjs/operators';
import { HistoriaClinicaComponent } from '../historia-clinica/historia-clinica.component';
import { ReactiveFormsModule, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  filtrosForm: FormGroup;
  pageSize: number = 15;
  currentPage: number = 1;

  columnas = [
    { key: 'codigo', label: 'Código' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'codMedico', label: 'Cod. Médico' },
    { key: 'hora', label: 'Hora' },
    { key: 'tipoCita', label: 'Tipo Cita' },
    { key: 'servicio', label: 'Servicio' },
    { key: 'cedula', label: 'Cédula' },
    { key: 'adicional', label: 'Adicional' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'codPlan', label: 'Cod. Plan' },
    { key: 'legalizacion', label: 'Legalización' },
    { key: 'pago', label: 'Pago' },
    { key: 'prestam', label: 'Prestam' }
  ];

  constructor(private fb: FormBuilder) {
    this.filtrosForm = this.fb.group({});
    // Inicializar los controles del formulario
    this.columnas.forEach(columna => {
      this.filtrosForm.addControl(columna.key, this.fb.control(''));
    });
  }

  ngOnInit() {
    this.cargarCitas();
    this.filtrosForm = new FormGroup({});
    this.columnas.forEach(columna => {
      this.filtrosForm.addControl(columna.key, new FormControl(''));
    });
  
    this.configurarFiltros();
  }

  getFormControl(key: string): FormControl {
    return this.filtrosForm.get(key) as FormControl;
  }
  

  cargarCitas() {
    // Aquí deberías hacer la llamada a tu servicio
    this.citas = [
      {
        codigo: 'C001',
        fecha: '2024-03-20',
        codMedico: 'M123',
        hora: '09:00',
        tipoCita: 'General',
        servicio: 'Consulta Externa',
        cedula: '12345678',
        adicional: 'N/A',
        nombre: 'Juan',
        apellido: 'Pérez',
        codPlan: 'P001',
        legalizacion: 'Sí',
        pago: 'Realizado',
        prestam: 'No'
      },
      {
        codigo: 'C002',
        fecha: '2024-03-21',
        codMedico: 'M124',
        hora: '10:00',
        tipoCita: 'Especialista', 
        servicio: 'Consulta Externa',
        cedula: '87654321',
        adicional: 'N/A',
        nombre: 'Ana',
        apellido: 'Gómez',
        codPlan: 'P002',  
        legalizacion: 'No',
        pago: 'Pendiente',
        prestam: 'Sí'
      },  
      {
        codigo: 'C003',
        fecha: '2024-03-22',
        codMedico: 'M125',
        hora: '11:00',
        tipoCita: 'General',  
        servicio: 'Consulta Externa',
        cedula: '98765432',
        adicional: 'N/A',
        nombre: 'Carlos',
        apellido: 'López',
        codPlan: 'P003',
        legalizacion: 'Sí',
        pago: 'Realizado',
        prestam: 'No'
      }
      
      

    ];
    this.citasFiltradas = [...this.citas];
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
        
        const citaValue = String(cita[columna.key as keyof CitaMedica])?.toLowerCase();
        return citaValue.includes(filterValue);
      });
    });
  }
  
  verHistoriaClinica(cedula: string) {
    this.pacienteSeleccionadoId = cedula;
    this.mostrarHistoria = true;
  }

  cerrarHistoriaClinica() {
    this.mostrarHistoria = false;
    this.pacienteSeleccionadoId = null;
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
}
