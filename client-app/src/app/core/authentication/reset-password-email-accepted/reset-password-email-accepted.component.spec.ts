import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordEmailAcceptedComponent } from './reset-password-email-accepted.component';

describe('ResetPasswordEmailAcceptedComponent', () => {
  let component: ResetPasswordEmailAcceptedComponent;
  let fixture: ComponentFixture<ResetPasswordEmailAcceptedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetPasswordEmailAcceptedComponent]
    });
    fixture = TestBed.createComponent(ResetPasswordEmailAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
