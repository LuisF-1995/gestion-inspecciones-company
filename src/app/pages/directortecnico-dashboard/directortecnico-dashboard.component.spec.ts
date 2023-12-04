import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectortecnicoDashboardComponent } from './directortecnico-dashboard.component';

describe('DirectortecnicoDashboardComponent', () => {
  let component: DirectortecnicoDashboardComponent;
  let fixture: ComponentFixture<DirectortecnicoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectortecnicoDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirectortecnicoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
