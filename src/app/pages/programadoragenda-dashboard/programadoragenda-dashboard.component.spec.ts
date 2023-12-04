import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramadoragendaDashboardComponent } from './programadoragenda-dashboard.component';

describe('ProgramadoragendaDashboardComponent', () => {
  let component: ProgramadoragendaDashboardComponent;
  let fixture: ComponentFixture<ProgramadoragendaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramadoragendaDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgramadoragendaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
