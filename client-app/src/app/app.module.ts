import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './shared/layout/navbar/navbar.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { LoginComponent } from './core/authentication/login/login.component';
import { SignupComponent } from './core/authentication/signup/signup.component';
import { AngularMaterialsModule } from './shared/other-resources/app.angular-materials.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HomepageComponent } from './core/components/homepages/homepage/homepage.component';
import { SearchComponent } from './shared/other-functionalities/search/search.component';
import { ProfileSettingsComponent } from './core/components/settings/profile-settings/profile-settings.component';
import { OtherSettingsComponent } from './core/components/settings/other-settings/other-settings.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InfoDialogPatientComponent } from './shared/other-resources/info-dialog-patient/info-dialog-patient.component';
import { InfoDialogDoctorComponent } from './shared/other-resources/dialogs/info-dialog-doctor/info-dialog-doctor.component';
import { ActivateAccountComponent } from './core/authentication/activate-account/activate-account.component';
import { InfoDialogActivateAccountComponent } from './shared/other-resources/dialogs/info-dialog-admin-doctor-preview/info-dialog-admin-doctor-preview.component';
import { ResetPasswordComponent } from './core/authentication/reset-password/reset-password.component';
import { InfoDialogResetPasswordComponent } from './shared/other-resources/dialogs/info-dialog-reset-password/info-dialog-reset-password.component';
import { ResetPasswordEmailAcceptedComponent } from './core/authentication/reset-password-email-accepted/reset-password-email-accepted.component';
import { HomepageAdministratorComponent } from './core/components/homepages/homepage-administrator/homepage-administrator.component';
import { NotFoundComponent } from './shared/other-functionalities/not-found/not-found.component';
import { SendEmailAdminComponent } from './shared/other-resources/dialogs/send-email-admin/send-email-admin.component';
import { DoctorListingComponent } from './core/components/doctor-listing/doctor-listing.component';
import { DoctorPreviewComponent } from './core/components/doctor-preview/doctor-preview.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ScheduleComponent } from './core/components/tabs/schedule/schedule.component';
import { AppointmentsComponent } from './core/components/tabs/appointments/appointments.component';
import { NotificationsComponent } from './core/components/tabs/notifications/notifications.component';
import { TabsRoutingComponent } from './core/components/tabs/tabs-routing/tabs-routing.component';
import { InfoDialogSetAppointmentComponent } from './shared/other-resources/dialogs/set-appointment-dialog/set-appointment-dialog.component';
import { InfoDialogPatientPreviewComponent } from './shared/other-resources/dialogs/patient-preview-dialog/patient-preview-dialog.component';
import { HelpPageComponent } from './core/components/help-page/help-page.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapsComponent } from './core/components/google-api/google-maps/google-maps.component';
import { ToastrModule } from 'ngx-toastr';
import { GoogleAdressesInputComponent } from './shared/other-functionalities/google-adresses-input/google-adresses-input.component';
import { FormsModule } from '@angular/forms';
import { InfoDialogPatientAccountActivatedComponent } from './shared/other-resources/dialogs/info-dialog-patient-account-activated/info-dialog-patient-account-activated.component';
import { SymptomCheckerComponent } from './core/components/symptom-checker/symptom-checker.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomepageComponent,
    SearchComponent,
    ProfileSettingsComponent,
    OtherSettingsComponent,
    InfoDialogPatientComponent,
    InfoDialogDoctorComponent,
    ActivateAccountComponent,
    InfoDialogActivateAccountComponent,
    ResetPasswordComponent,
    InfoDialogResetPasswordComponent,
    ResetPasswordEmailAcceptedComponent,
    HomepageAdministratorComponent,
    NotFoundComponent,
    SendEmailAdminComponent,
    DoctorListingComponent,
    DoctorPreviewComponent,
    ScheduleComponent,
    AppointmentsComponent,
    NotificationsComponent,
    TabsRoutingComponent,
    InfoDialogSetAppointmentComponent,
    InfoDialogPatientPreviewComponent,
    HelpPageComponent,
    GoogleMapsComponent,
    GoogleAdressesInputComponent,
    InfoDialogPatientAccountActivatedComponent,
    SymptomCheckerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NavbarComponent,
    FooterComponent,
    AngularMaterialsModule,
    ReactiveFormsModule,
    HttpClientModule,
    GoogleMapsModule,
    ToastrModule.forRoot({
      preventDuplicates: false,
      progressBar: true,
      countDuplicates: true,
      extendedTimeOut: 3000,
      positionClass: 'toast-bottom-right',
    }),
    FormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      }
    })
   ],
  providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }],
  bootstrap: [AppComponent]
})
export class AppModule { }
