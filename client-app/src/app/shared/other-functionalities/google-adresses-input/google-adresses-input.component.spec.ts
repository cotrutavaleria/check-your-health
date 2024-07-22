import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleAdressesInputComponent } from './google-adresses-input.component';

describe('GoogleAdressesInputComponent', () => {
  let component: GoogleAdressesInputComponent;
  let fixture: ComponentFixture<GoogleAdressesInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoogleAdressesInputComponent]
    });
    fixture = TestBed.createComponent(GoogleAdressesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
