import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalarioComponent } from './hospitalario.component';

describe('HospitalarioComponent', () => {
  let component: HospitalarioComponent;
  let fixture: ComponentFixture<HospitalarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HospitalarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
