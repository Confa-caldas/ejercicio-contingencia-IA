import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { HistoriaClinicaComponent } from './historia-clinica/historia-clinica.component';
import { CitasMedicasComponent } from './citas-medicas/citas-medicas.component';
import { MedicamentosComponent } from './medicamentos/medicamentos.component';
import { HospitalarioComponent } from './hospitalario/hospitalario.component';
import { AmbulatorioComponent } from './ambulatorio/ambulatorio.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'historia-clinica/:id', component: HistoriaClinicaComponent },
  { path: 'citas-medicas', component: CitasMedicasComponent },
  { path: 'medicamentos/:id', component: MedicamentosComponent },
  { path: 'menu', component: MenuComponent, children: [
      { path: 'hospitalario', component: HospitalarioComponent },
      { path: 'ambulatorio', component: AmbulatorioComponent }
    ]
  }
];
