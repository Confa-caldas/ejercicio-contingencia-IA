export interface Medicamento {
  prefijo: string;
  medicamento: string;
  nombreMedicamento: string;
  dosis: string;
  observacionEnfermeria: string;
  horaAplicacion: string;
  origenMedicamento: string;
  unidadAdministracion: string;
  viaAdministracion: string;
  indicacionEspecial: string;
  frecuencia: string;
  estado: string;
  cantidadTotal: string;
  cantidadPorAplicacion: string;
  cantidadAplicado: string;
  cantidadNoAplicado: string;
  nombreUnidadTiempo: string;
  horaPlaneadaAplicacion: string;
  secOrdenamiento: string;
  numItem: string;
  causaNoAplicacion: string;
  idOrden: string;
  observacionAplicacion: string;
  fechaFormulacion: string;
  prefijoCodigoMedicamento: string;
  campo_01: string;
  campo_02: string;
  campo_10: string;
  frecuenciaDividida: string;
  totalHoras: string;
  cantidadTotal1: string;
  rn: string;
}

export interface MedicamentoResponse {
  codigoSAB: string;
  convenio: string;
  plan: string;
  codigoPlan: string;
  hcAfiliacion: string;
  hcAdicional: string;
  nombre: string;
  numeroDocumento: string;
  numeroCama: string;
  numeroAdmision: string;
  sexo: string;
  fechaNacimiento: string;
  tipoDocumento: string;
  listMedicamentos: Medicamento[];
  respuesta: string;
}

export interface HistoriaClinica {
  consecutivo: string;
  fecha: string;
  codMedico: string;
  nombreMedico: string;
  codEspecialidad: string;
  nombreEspecialidad: string;
  codDiagnostico: string;
  descripcionDiagnostico: string;
  tipoDiagnostico: string;
  visita: string;
  causaExterna: string;
  descripcionCausa: string;
  finalidad: string;
  descripcionfinalidad: string;
  atencion: string;
  clasePla: string;
  descripcionPla: string;
  cedula: string;
  adicional: string;
  // Campos adicionales para citas
  hora?: string;
  servicio?: string;
  tipoCita?: string;
  codigoSab?: string;
  cedulaPaciente?: string;
  nombrePaciente?: string;
  codPlan?: string;
  legalizacion?: string;
  pago?: string;
  prestamo?: string;
}

export interface DetalleHistoriaClinica {
  consecutivo?: string;
  plantilla?: string;
  historiaClinica?: string;
  razonSocial?: string;
  plan?: string;
  afiliacion?: string;
  sexo?: string;
  edad?: string;
  nombre?: string;
  descdx?: string;
  descmotivo?: string;
  visita?: string;
  listadoCamposPlantilla?: string;
  medNom?: string;
  medCed?: string;
  medReg?: string;
  especialidad?: string;
  fechahc?: string;
  horaHc?: string;
  txt?: string;

}

export interface CitaMedica {
  codigoSab: string;
  fecha: string;
  codigoMedico: string;
  hora: string;
  tipoCita: string;
  servicio?: string;
  cedulaPaciente?: string;
  nombrePaciente: string;
  adicional?: string;
  codPlan?: string;
  legalizacion: string;
  pago: string;
  prestamo?: string;
}

interface HistoriaCitaMedica {
  codigoSab: string;
  fecha: string;
  codigoMedico: string;
  hora: string;
  tipoCita: string;
  servicio: string;
  cedulaPaciente: string;
  nombrePaciente: string;
  adicional: string;
  codPlan: string;
  legalizacion: string;
  pago: string;
  prestamo: string;
  txt?: string;
}

