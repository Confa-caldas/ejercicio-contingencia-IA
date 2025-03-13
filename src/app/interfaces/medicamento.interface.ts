export interface Medicamento {
  nombre: string;
  dosis: string;
  observacion: string;
  horaAplicacion: string;
  origen: string;
  unidadAdministracion: string;
  viaAdministracion: string;
  indicacionEspecial: string;
  frecuencia: string;
  estado: string;
}

export interface HistoriaClinica {
  id: number;
  fecha: string;
  medico: string;
  especialidad: string;
  plantilla: string;
  atencion: string;
  detalles: {
    motivo: string;
    diagnostico: string;
    tratamiento: string;
    observaciones: string;
  };  
}

export interface CitaMedica {
  codigo: string;
  fecha: string;
  codMedico: string;
  hora: string;
  tipoCita: string;
  servicio: string;
  cedula: string;
  adicional: string;
  nombre: string; 
  apellido: string;
  codPlan: string;
  legalizacion: string;
  pago: string;
  prestam: string;
}

