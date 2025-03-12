import { Component } from '@angular/core';

@Component({
  selector: 'app-citas-medicas',
  standalone: true,
  imports: [],
  templateUrl: './citas-medicas.component.html',
  styleUrl: './citas-medicas.component.css'
})
export class CitasMedicasComponent {
  filtrarCitas(event: any) {
    const fechaSeleccionada = event.target.value;
    // Lógica para filtrar citas por fecha
  }
}
