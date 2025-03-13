import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbulatorioComponent } from './ambulatorio.component';

describe('AmbulatorioComponent', () => {
  let component: AmbulatorioComponent;
  let fixture: ComponentFixture<AmbulatorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmbulatorioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AmbulatorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
