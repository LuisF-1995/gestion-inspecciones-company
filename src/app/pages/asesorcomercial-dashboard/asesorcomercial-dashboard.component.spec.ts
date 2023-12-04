import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsesorcomercialDashboardComponent } from './asesorcomercial-dashboard.component';

describe('AsesorcomercialDashboardComponent', () => {
  let component: AsesorcomercialDashboardComponent;
  let fixture: ComponentFixture<AsesorcomercialDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsesorcomercialDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsesorcomercialDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
