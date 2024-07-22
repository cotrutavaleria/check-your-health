import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDialogDoctorComponent } from './info-dialog-doctor.component';

describe('InfoDialogDoctorComponent', () => {
  let component: InfoDialogDoctorComponent;
  let fixture: ComponentFixture<InfoDialogDoctorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoDialogDoctorComponent]
    });
    fixture = TestBed.createComponent(InfoDialogDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
