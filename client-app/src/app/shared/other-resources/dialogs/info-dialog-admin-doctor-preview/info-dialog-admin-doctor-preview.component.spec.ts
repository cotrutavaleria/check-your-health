import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDialogActivateAccountComponent } from './info-dialog-admin-doctor-preview.component';

describe('InfoDialogActivateAccountComponent', () => {
  let component: InfoDialogActivateAccountComponent;
  let fixture: ComponentFixture<InfoDialogActivateAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoDialogActivateAccountComponent]
    });
    fixture = TestBed.createComponent(InfoDialogActivateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
