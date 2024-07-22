import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDialogResetPasswordComponent } from './info-dialog-reset-password.component';

describe('InfoDialogResetPasswordComponent', () => {
  let component: InfoDialogResetPasswordComponent;
  let fixture: ComponentFixture<InfoDialogResetPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoDialogResetPasswordComponent]
    });
    fixture = TestBed.createComponent(InfoDialogResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
