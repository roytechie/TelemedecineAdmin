import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { ListSubmissionsComponent } from './components/list-submissions/list-submissions.component';
import { LoginComponent } from './components/login/login/login.component';
import { ViewSubmissionComponent } from './components/view-submission/view-submission.component';
import { AccountLayoutComponent } from './components/login/account-layout/account-layout.component';
import { AssignStatesComponent } from './components/login/assign-states/assign-states.component';
import { ForgotPasswordComponent } from './components/login/forgot-password/forgot-password.component';
import { ProfileComponent } from './components/login/profile/profile.component';
import { ResetPasswordComponent } from './components/login/reset-password/reset-password.component';
import { LoginDetails, ReportRequest } from './model/login-details';
import { AthenticationService } from './service/athentication.service';
import { AdminService } from './service/admin.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { PatiantInformation } from './model/PatiantInformation';
import { NotesComponent } from './components/login/notes/notes.component';
import { ReplacePipe } from 'src/app/pipes/replace.pipe';
import { DoctorsFormComponent } from './components/doctors-form/doctors-form.component';
import { PaymentReportComponent } from './components/payment-report/payment-report.component';
import { SignUpComponent } from './components/login/sign-up/sign-up.component';
import { UserListComponent } from './components/login/user-list/user-list.component';
import { ActivityLogsComponent } from './components/activity-logs/activity-logs.component';
import { VerificationCodeComponent } from './components/verification-code/verification-code.component';
import { AuthorizationFormComponent } from './components/authorization/authorization-form/authorization-form.component';
import { Address } from './model/address';
import { LicenseRegistration } from './model/license-registration';
import { ProfessionalReferences } from './model/professional-references';
import { DEARegistration } from './model/dearegistration';
import { CountryList, ProviderInformation } from './model/provider-information';
import { FileToUpload, UserDetails } from './model/user-details';
import { DEARegistrationComponent } from './components/authorization/dearegistration/dearegistration.component';
import { LicenseRegistrationsComponent } from './components/authorization/license-registrations/license-registrations.component';
import { ProfessionalReferencesComponent } from './components/authorization/professional-references/professional-references.component';
import { FilterPipe } from 'src/app/pipes/filter.pipe'; 
import { SignaturePadComponent } from './components/authorization/signature-pad/signature-pad.component';
import { ProgressComponent } from './components/progress/progress.component';
import { UpdateSubmissionDialogComponent } from './components/authorization/update-submission-dialog/update-submission-dialog.component';
import { SendmailPatientComponent } from './components/sendmail-patient/sendmail-patient.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { PharmacyReportComponent } from './components/pharmacy-report/pharmacy-report.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MedicineComponent } from './components/medicine/medicine.component';
import { EditMedicineComponent } from './components/medicine/edit-medicine/edit-medicine.component';

@NgModule({
  declarations: [
    LayoutComponent,
    ListSubmissionsComponent,
    LoginComponent,
    ViewSubmissionComponent,
    AccountLayoutComponent,
    AssignStatesComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    ResetPasswordComponent,
    NotesComponent,
    ReplacePipe,
    DoctorsFormComponent,
    PaymentReportComponent,
    SignUpComponent,
    UserListComponent,
    ActivityLogsComponent,
    VerificationCodeComponent,
    AuthorizationFormComponent, 
    DEARegistrationComponent,
    LicenseRegistrationsComponent,
    ProfessionalReferencesComponent, 
    FilterPipe,
    SignaturePadComponent,
    ProgressComponent,
    UpdateSubmissionDialogComponent,
    SendmailPatientComponent,
    AlertDialogComponent,
    PharmacyReportComponent,
    ConfirmDialogComponent,
    MedicineComponent,
    EditMedicineComponent
  ], 
  imports: [
    CommonModule,
    AngularEditorModule,
    FormsModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [LoginDetails,
    AthenticationService,
    AdminService,
    PatiantInformation,
    ReportRequest,
    //StausOptions,
    Address,
    DEARegistration,
    LicenseRegistration,
    ProfessionalReferences,
    ProviderInformation,
    UserDetails,
    FileToUpload,
    CountryList
    ],
    entryComponents: [DoctorsFormComponent], 
})
export class AdminModule { }
