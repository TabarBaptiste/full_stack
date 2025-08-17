import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestationsFormComponent } from './prestations-form.component';

describe('PrestationsFormComponent', () => {
  let component: PrestationsFormComponent;
  let fixture: ComponentFixture<PrestationsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestationsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestationsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
