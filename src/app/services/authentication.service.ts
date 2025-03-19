import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RespuestaServidor } from '../interfaces/respuestaValida.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  consultarIp() {
    const url = environment.consultarIp;
    let response = this.http.post(url, '');
    return response;
  }

  inicioSesionInternoV2(imagen: string) {
    let body = {
      imgdata: imagen,
      excepcion: environment.excepcionFacial,
      tipoValidacion: environment.tipoValidacionFacial,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': 'qfdmzeFdxN2VetG1dYgRB4jLrxHrLTveaxss0aMH',
    });
    const url = environment.consultaLambdaDirecta;
    return this.http.post(url, body, { headers });
  }

  inicioSesionSas(body: any) {
    const url = environment.identificacionSas + 'metodo1';
    let response = this.http.post(url, body);    
    return response;
  }

  obtenerPacientesSab(sab: string, token: string){
    const url = environment.identificacionSas + 'metodo2';
    const body = {
      codigo_sab: sab
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    let response = this.http.post(url, body, httpOptions);
    return response;
  }

  obtenerSab(token: string){
    const url = environment.identificacionSas + 'metodo3';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    let response = this.http.get(url, httpOptions);
    return response;
  }

  obtenerHCPaciente(documento: string, token: string, adicional: string){
    const url = environment.identificacionSas + 'metodo4';
    const body = {
      cedula: documento,
      adicional: adicional
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    let response = this.http.post(url, body, httpOptions);
    return response;
  }
  
  obtenerMedicamentos(token: string, nro_admision: string, codigo_sab: string){
    const url = environment.identificacionSas + 'metodo5';
    const body = {
      nro_admision: nro_admision,
      codigo_sab: codigo_sab
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    let response = this.http.post(url, body, httpOptions);
    return response;
  }

  obtenerDetalleHC(consecutivo: string, token: string){
    const url = environment.identificacionSas + 'metodo6';
    const body = {
      consecutivo: consecutivo
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    let response = this.http.post(url, body, httpOptions);
    return response;
  }

  obtenerCitasMedicas(token: string){
    const url = environment.identificacionSas + 'metodo7';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    let response = this.http.get(url, httpOptions);
    return response;
  }

  obtenerHCPacienteCitas(documento: string, token: string, adicional: string){
    const url = environment.identificacionSas + 'metodo8';
    const body = {
      cedula: documento,
      adicional: adicional
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    let response = this.http.post(url, body, httpOptions);
    return response;
  }
  obtenerDetalleHCCitas(consecutivo: string, token: string){
    const url = environment.identificacionSas + 'metodo9';
    const body = {
      consecutivo: consecutivo
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    let response = this.http.post(url, body, httpOptions);
    return response;
  }

  esTokenValido(respuesta: RespuestaServidor): boolean {
    return 'codigoSab' in respuesta;
  }

  esTokenInvalido(respuesta: RespuestaServidor): boolean {
    return 'error' in respuesta;
  }

}
