import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailAdminComponent } from './send-email-admin.component';

describe('SendEmailAdminComponent', () => {
  let component: SendEmailAdminComponent;
  let fixture: ComponentFixture<SendEmailAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendEmailAdminComponent]
    });
    fixture = TestBed.createComponent(SendEmailAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
