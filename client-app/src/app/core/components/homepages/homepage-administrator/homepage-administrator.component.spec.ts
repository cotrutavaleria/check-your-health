import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageAdministratorComponent } from './homepage-administrator.component';

describe('HomepageAdministratorComponent', () => {
  let component: HomepageAdministratorComponent;
  let fixture: ComponentFixture<HomepageAdministratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomepageAdministratorComponent]
    });
    fixture = TestBed.createComponent(HomepageAdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
