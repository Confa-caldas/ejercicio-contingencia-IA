export interface Paciente {
  nombre: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  fechaNacimiento?: string;
  sexo?: string;
  codigoSAB?: string;
  codigoPlan?: string;
  numeroCama?: string;
  numeroAdmision?: string;
  convenio?: string;
  hcAdicional?: string;
  plan?: string;
  hcAfiliacion?: string;
}

export interface Token {
  token?: string;
  mensaje?: string;
}
