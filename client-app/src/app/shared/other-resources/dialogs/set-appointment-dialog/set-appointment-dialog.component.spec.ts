import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDialogSetAppointmentComponent } from './set-appointment-dialog.component';

describe('InfoDialogSetAppointmentComponent', () => {
  let component: InfoDialogSetAppointmentComponent;
  let fixture: ComponentFixture<InfoDialogSetAppointmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoDialogSetAppointmentComponent]
    });
    fixture = TestBed.createComponent(InfoDialogSetAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
