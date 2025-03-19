import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil, WebcamModule } from 'ngx-webcam';
import { ReactiveFormsModule, UntypedFormGroup, UntypedFormControl, Validators } from "@angular/forms";
import { AuthenticationService } from '../services/authentication.service';
import { UtilitiesServiceService } from '../services/utilities.service';
import { ModalMessagesComponent } from '../modal-messages/modal-messages.component';
import { CommonModule } from '@angular/common';
import $ from 'jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [WebcamModule, ReactiveFormsModule, CommonModule, ModalMessagesComponent],
})
export class LoginComponent {
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string = '';
  public videoOptions: MediaTrackConstraints = {};
  public errors: WebcamInitError[] = [];
  public nombreUsuario: string = '';

  public webcamImage: WebcamImage | null = null;

  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  constructor(private router: Router, private authenticationService: AuthenticationService, private utilitiesService: UtilitiesServiceService) { }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    this.nextWebcam.next(directionOrDeviceId);
  }

  handleImage(webcamImage: WebcamImage ): void {
    this.webcamImage = webcamImage;
    this.validateFace();
    //this.router.navigate(['/menu']);
  }

  validateFace() {

    this.utilitiesService.loading = true;
    if (this.webcamImage) {
      this.authenticationService
        .inicioSesionInternoV2(this.webcamImage.imageAsBase64)
        .subscribe(
          (response: any) => {
            if (
              response.doc === 'No se identifico.' ||
              response.doc === 'error'
            ) {
              this.utilitiesService.loading = false;
              setTimeout(() => {
                this.utilitiesService.showError('¡Ten presente!', response.doc);
                $('.btn-modal-error').click();
              }, 500);
            } else {
              if (response.est) {
                const estadoUsuario = response.est;
                const numeroDocumento: String[] = response.doc
                  .toString()
                  .split('-');
                if (numeroDocumento[0] != null && numeroDocumento[0] != '' && this.webcamImage) {
                  let bodySas = {
                    documento: numeroDocumento[0],
                  }
                  if (estadoUsuario) {
                    this.authenticationService.inicioSesionSas(bodySas).subscribe(
                      (response: any) => {
                        const estado = response.estado;
                        const respuesta = response.respuesta;
                        const nombre = response.nombre;
                        const token = response.token;
                        this.nombreUsuario = response.usuarioIngreso;
                        if (estado == 'Activo') {
                          this.loginExitoso(token, nombre, this.nombreUsuario);
                        } else {
                          setTimeout(() => {
                            this.utilitiesService.showError('¡Ten presente!', respuesta);
                            $('.btn-modal-error').click();
                          }, 500);
                        }
                      }
                    )
                    this.utilitiesService.loading = false;
                  } else {
                    this.utilitiesService.loading = false;
                    setTimeout(() => {
                      this.utilitiesService.showError('¡Ten presente!', response.mensaje);
                      $('.btn-modal-error').click();
                    }, 500);
                  }
                }
              } else {
                this.utilitiesService.loading = false;
                setTimeout(() => {
                  this.utilitiesService.showError('¡Ten presente!', response.msg);
                  $('.btn-modal-error').click();
                }, 500);
              }
            }

          },
          (error: any) => {
            this.utilitiesService.loading = true;
            setTimeout(() => {
              this.utilitiesService.showError('¡Ten presente!', error);
              $('.btn-modal-error').click();
            }, 500);
          }
        );
    }
  }

  cancelarInicioSesion() {
    this.router.navigate(['/']);
  }

  loginExitoso(token: string, nombreUsuario: string, nombreUsuario2: string){
    this.utilitiesService.loading= false;
    this.utilitiesService.login(token, nombreUsuario, nombreUsuario2)
    this.router.navigate(['/menu']);
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
