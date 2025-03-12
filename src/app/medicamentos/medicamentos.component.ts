import { Component } from '@angular/core';
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
export class MedicamentosComponent {
  mostrarInformacion = false;
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

  medicamentos: Medicamento[] = [];

  buscarPaciente(): void {
    const documento = (document.getElementById('searchDocumento') as HTMLInputElement).value;
    // Simulación de búsqueda de paciente
    if (documento === '123456') {
      this.mostrarInformacion = true;
      this.paciente = {
        nombre: 'Juan Pérez',
        tipoDocumento: 'CC',
        numeroDocumento: '123456',
        fechaNacimiento: '1990-01-01',
        sexo: 'Masculino',
        codigoSAB: 'SAB123',
        codigoPlan: 'PLAN456',
        numeroCama: '101',
        numeroAdmision: 'ADM789',
        convenio: 'Convenio A'
      };

      this.medicamentos = [
        {
          nombre: 'Paracetamol',
          dosis: '500mg',
          observacion: 'Tomar cada 8 horas',
          horaAplicacion: '08:00',
          origen: 'Hospital',
          unidadAdministracion: 'Tableta',
          viaAdministracion: 'Oral',
          indicacionEspecial: 'Con alimentos',
          frecuencia: 'Cada 8 horas',
          estado: 'Activo'
        }
        // Agrega más medicamentos si es necesario
      ];
    } else {
      this.mostrarInformacion = false;
      // Manejar caso de paciente no encontrado
      alert('Paciente no encontrado');
    }
  }
}
