import { Component } from '@angular/core';
import { CitasMedicasComponent } from '../citas-medicas/citas-medicas.component';
@Component({
  selector: 'app-ambulatorio',
  standalone: true,
  imports: [CitasMedicasComponent],
  templateUrl: './ambulatorio.component.html',
  styleUrl: './ambulatorio.component.css'
})
export class AmbulatorioComponent {

}
