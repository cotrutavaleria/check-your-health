import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './core/authentication/signup/signup.component';
import { LoginComponent } from './core/authentication/login/login.component';
import { HomepageComponent } from './core/components/homepages/homepage/homepage.component';
import { ProfileSettingsComponent } from './core/components/settings/profile-settings/profile-settings.component';
import { OtherSettingsComponent } from './core/components/settings/other-settings/other-settings.component';
import { ActivateAccountComponent } from './core/authentication/activate-account/activate-account.component';
import { ResetPasswordComponent } from './core/authentication/reset-password/reset-password.component';
import { ResetPasswordEmailAcceptedComponent } from './core/authentication/reset-password-email-accepted/reset-password-email-accepted.component';
import { HomepageAdministratorComponent } from './core/components/homepages/homepage-administrator/homepage-administrator.component';
import { NotFoundComponent } from './shared/other-functionalities/not-found/not-found.component';
import { DoctorListingComponent } from './core/components/doctor-listing/doctor-listing.component';
import { DoctorPreviewComponent } from './core/components/doctor-preview/doctor-preview.component';
import { ScheduleComponent } from './core/components/tabs/schedule/schedule.component';
import { AppointmentsComponent } from './core/components/tabs/appointments/appointments.component';
import { NotificationsComponent } from './core/components/tabs/notifications/notifications.component';
import { HelpPageComponent } from './core/components/help-page/help-page.component';
import { isAuthenticated } from './shared/services/authentication-guard/authenticated-users.guard';
import { GoogleMapsComponent } from './core/components/google-api/google-maps/google-maps.component';
import { SymptomCheckerComponent } from './core/components/symptom-checker/symptom-checker.component';
const routes: Routes = [
  { path: 'home', component: HomepageComponent, canActivate: [isAuthenticated] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home/admin', component: HomepageAdministratorComponent, canActivate: [isAuthenticated] },

  { path: 'settings/profile', component: ProfileSettingsComponent, canActivate: [isAuthenticated] },
  { path: 'settings/other-settings', component: OtherSettingsComponent, canActivate: [isAuthenticated] },

  { path: 'auth/login', component: LoginComponent, canActivate: [isAuthenticated] },
  { path: 'auth/signup', component: SignupComponent, canActivate: [isAuthenticated] },
  { path: 'auth/activate-account/:token', component: ActivateAccountComponent },
  { path: 'auth/reset-password', component: ResetPasswordComponent, canActivate: [isAuthenticated] },
  { path: 'auth/reset-password/:token', component: ResetPasswordEmailAcceptedComponent, canActivate: [isAuthenticated] },

  { path: 'search', component: DoctorListingComponent, canActivate: [isAuthenticated] },
  { path: 'doctor/:id', component: DoctorPreviewComponent, canActivate: [isAuthenticated] },

  { path: 'schedule', component: ScheduleComponent, canActivate: [isAuthenticated] },
  { path: 'appointments', component: AppointmentsComponent, canActivate: [isAuthenticated] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [isAuthenticated] },

  { path: 'help', component: HelpPageComponent },
  { path: 'symptom-checker', component: SymptomCheckerComponent, canActivate: [isAuthenticated] },

  { path: 'maps', component: GoogleMapsComponent },

  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
