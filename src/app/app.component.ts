import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ModalMessagesComponent } from './modal-messages/modal-messages.component';
import { LoadingComponent } from './loading/loading.component';
import { UtilitiesServiceService } from './services/utilities.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, ModalMessagesComponent, LoadingComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Salud Contingencia';

  constructor(
    public utilitiesService: UtilitiesServiceService
  ) { }
}
