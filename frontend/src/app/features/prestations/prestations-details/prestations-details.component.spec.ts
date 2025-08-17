import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestationsDetailsComponent } from './prestations-details.component';

describe('PrestationsDetailsComponent', () => {
  let component: PrestationsDetailsComponent;
  let fixture: ComponentFixture<PrestationsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestationsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestationsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
