import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistoriaClinica, DetalleHistoriaClinica } from '../interfaces/medicamento.interface';
import { AuthenticationService } from '../services/authentication.service';
import { UtilitiesServiceService } from '../services/utilities.service';
import { Paciente } from '../interfaces/paciente.interface';
import { CommonModule } from '@angular/common'; 
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css'
})
export class HistoriaClinicaComponent implements OnChanges {
  @Input() paciente: Paciente | null = null;
  @Input() origen: 'hospitalario' | 'citas' = 'hospitalario'; 
  historias: HistoriaClinica[] = [];
  historiaSeleccionada: HistoriaClinica | null = null;
  detalleHistoria: DetalleHistoriaClinica | null = null;
  pageSize: number = 15;
  currentPage: number = 1;

  constructor(private route: ActivatedRoute, private authService: AuthenticationService, private utilitiesService: UtilitiesServiceService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['paciente'] && this.paciente) {
      this.cargarHistoriasClinicas();
    }
  }

  async cargarHistoriasClinicas() {
    this.utilitiesService.loading = true;
    if (!this.paciente){
      this.utilitiesService.loading = false;
      this.utilitiesService.showError('Error al cargar historias clínicas:', 'No se encontró el paciente');
      $('.btn-modal-error').click();
      return;
    } 
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        this.utilitiesService.loading = false;
        this.utilitiesService.showError('Error al cargar historias clínicas:', 'No se encontró el token');
        $('.btn-modal-error').click();
        return;
      }
      if (this.origen === 'citas') {
        const response = await firstValueFrom(
          this.authService.obtenerHCPacienteCitas(
            this.paciente.numeroDocumento || '',
            token,
            this.paciente.hcAdicional || ''
          )
        );

        this.historias = Array.isArray(response) ? response : [response];

      } else {
        const response = await firstValueFrom(
          this.authService.obtenerHCPaciente(
            this.paciente.numeroDocumento || '',
            token,
            this.paciente.hcAdicional || ''
          )
        );
        console.log(response);
        this.historias = Array.isArray(response) ? response : [response];
      }
      this.utilitiesService.loading = false;
      this.currentPage = 1;
      this.utilitiesService.loading = false;
    } catch (error) {
      this.utilitiesService.loading = false;
      this.utilitiesService.showError('Error al cargar historias clínicas:', error as string);
      $('.btn-modal-error').click();
      this.historias = [];
    }
  }

  async verDetalle(historia: any) {
    this.utilitiesService.loading = true;
    if (this.historiaSeleccionada?.consecutivo === historia.consecutivo) {
      this.historiaSeleccionada = null;
      this.detalleHistoria = null;
      this.utilitiesService.loading = false;
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        this.utilitiesService.loading = false;
        this.utilitiesService.showError('Error al cargar el detalle:', 'No se encontró el token');
        $('.btn-modal-error').click();
        return;
      }

      this.historiaSeleccionada = historia;
      const response = await firstValueFrom(
        this.origen === 'citas'
          ? this.authService.obtenerDetalleHCCitas(historia.consecutivo, token)
          : this.authService.obtenerDetalleHC(historia.consecutivo, token)
      );

      const detalleResponse = Array.isArray(response) ? response[0] : response;
      
      if (!detalleResponse) {
        this.detalleHistoria = {
          txt: 'No hay detalle disponible',
        } as DetalleHistoriaClinica;
      } else {
        this.detalleHistoria = detalleResponse;
      }
      
      this.utilitiesService.loading = false;
    } catch (error) {
      this.utilitiesService.loading = false;
      this.utilitiesService.showError('Error al cargar el detalle:', error as string);
      $('.btn-modal-error').click();
      this.historiaSeleccionada = null;
      this.detalleHistoria = null;
    }
  }
  formatearTexto(texto: string): string[] {
    if (!texto) return ['No disponible'];
    
    const lineas = texto.split('\n').map(linea => linea.trim()).filter(linea => linea);
    
    return lineas.map(linea => {
      // Si la línea contiene "==>>", es un título con contenido
      if (linea.includes('==>>')) {
        const [titulo, contenido] = linea.split('==>>').map(parte => parte.trim());
        return `<strong>${titulo}</strong>${contenido ? ': ' + contenido : ''}`;
      }
      // Si la línea está en mayúsculas, probablemente es un título
      else if (linea === linea.toUpperCase() && linea.length > 3) {
        return `<strong>${linea}</strong>`;
      }
      // Si la línea comienza con *, es un punto de lista
      else if (linea.startsWith('*')) {
        return `<span style="margin-left: 1rem;">• ${linea.substring(1).trim()}</span>`;
      }
      // Línea normal
      return linea;
    });
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

  private formatearFecha(fecha: string): string {
    return fecha.replace(/\//g, '-');
  }
}
