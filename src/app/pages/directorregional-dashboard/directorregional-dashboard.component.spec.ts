import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorregionalDashboardComponent } from './directorregional-dashboard.component';

describe('DirectorregionalDashboardComponent', () => {
  let component: DirectorregionalDashboardComponent;
  let fixture: ComponentFixture<DirectorregionalDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorregionalDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirectorregionalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
