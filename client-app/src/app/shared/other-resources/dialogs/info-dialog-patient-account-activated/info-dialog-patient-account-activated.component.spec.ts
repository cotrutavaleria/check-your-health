import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDialogPatientAccountActivatedComponent } from './info-dialog-patient-account-activated.component';

describe('InfoDialogPatientAccountActivatedComponent', () => {
  let component: InfoDialogPatientAccountActivatedComponent;
  let fixture: ComponentFixture<InfoDialogPatientAccountActivatedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoDialogPatientAccountActivatedComponent]
    });
    fixture = TestBed.createComponent(InfoDialogPatientAccountActivatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
