import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDialogPatientPreviewComponent } from './patient-preview-dialog.component';

describe('InfoDialogPatientPreviewComponent', () => {
  let component: InfoDialogPatientPreviewComponent;
  let fixture: ComponentFixture<InfoDialogPatientPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoDialogPatientPreviewComponent]
    });
    fixture = TestBed.createComponent(InfoDialogPatientPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
