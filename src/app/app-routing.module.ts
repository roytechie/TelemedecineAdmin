import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountLayoutComponent } from './modules/admin/components/login/account-layout/account-layout.component';
import { LoginComponent } from './modules/admin/components/login/login/login.component';
import { ResetPasswordComponent } from './modules/admin/components/login/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './modules/admin/components/login/forgot-password/forgot-password.component';
import { LayoutComponent } from './modules/admin/components/layout/layout.component';
import { ListSubmissionsComponent } from './modules/admin/components/list-submissions/list-submissions.component';
import { NotesComponent } from './modules/admin/components/login/notes/notes.component';
import { ViewSubmissionComponent } from './modules/admin/components/view-submission/view-submission.component';
import { PaymentReportComponent } from './modules/admin/components/payment-report/payment-report.component';
import { SignUpComponent } from './modules/admin/components/login/sign-up/sign-up.component';
import { UserListComponent } from './modules/admin/components/login/user-list/user-list.component';
import { ActivityLogsComponent } from './modules/admin/components/activity-logs/activity-logs.component';
import { VerificationCodeComponent } from './modules/admin/components/verification-code/verification-code.component';
import { AuthorizationFormComponent } from './modules/admin/components/authorization/authorization-form/authorization-form.component';
import { PahrmacyReportComponent } from './modules/reports/component/pahrmacy-report/pahrmacy-report.component';
import { RefillComponent } from './modules/reports/component/refill/refill.component';
import {ReferralsComponent} from './modules/reports/component/referrals/referrals.component'
import { SendmailPatientComponent } from './modules/admin/components/sendmail-patient/sendmail-patient.component';
import { PharmacyReportComponent } from './modules/admin/components/pharmacy-report/pharmacy-report.component';
import { MedicineComponent } from './modules/admin/components/medicine/medicine.component';
import { MedicineDeliveryReportComponent } from './modules/reports/component/medicine-delivery-report/medicine-delivery-report.component';
import { ManagePharmacyComponent } from './modules/admin/components/manage-pharmacy/manage-pharmacy.component';


const routes: Routes = [ {
  path: '',
  component: AccountLayoutComponent,
  children : [
    {
      path: '',
      component : LoginComponent
    },
    {
      path: 'login',
      component : LoginComponent
    },
    {
      path: 'reset-password',
      component : ResetPasswordComponent
    },
    {
      path: 'reset-password/:id',
      component : ResetPasswordComponent
    },    
    {
      path: 'forgot-password',
      component : ForgotPasswordComponent
    },
    {  
      path: 'signup',
      component: SignUpComponent 
    }, 
    {  
      path: 'submission-notes',
      component: NotesComponent 
    }, 
    {
      path: 'verification-code/:root',
      component: VerificationCodeComponent
    },
  ]
  },
  {
    path: 'user',
    component : LayoutComponent,
    children : [
      {
        path: 'submissions-list',
        component: ListSubmissionsComponent
      },
      {  
        path: 'user-list',
        component: UserListComponent 
      },
      {
        path: 'payment-list',
        component: PaymentReportComponent
      },
      {
        path: 'submission-notes',
        component: NotesComponent
      },
      {
        path: 'activity-log',
        component : ActivityLogsComponent
      }, 
      {
        path: 'authorization-form',
        component : AuthorizationFormComponent
      }, 
      {
        path: 'authorization-form/:id',
        component : AuthorizationFormComponent
      },
      {
        path: 'sendmailtopatient',
        component : SendmailPatientComponent
      }, 
      {
        path: 'pharmacy-report',
        component : PharmacyReportComponent
      },
      {
        path: 'medicine',
        component : MedicineComponent
      },
      {
        path: 'managepharmacy',
        component : ManagePharmacyComponent
      }

    ]
  },
  {
    path: 'user',
    component : ViewSubmissionComponent,
    children : [{
      path: 'view-submission/:Id',
      component: ViewSubmissionComponent
    }]
  },
  {
    path: 'report',
    component: LayoutComponent,
    children: [{
      path: 'pharmacy',
      component: PahrmacyReportComponent
    },
    {
      path: 'refills',
      component: RefillComponent
    },
    {
      path: 'referrals',
      component: ReferralsComponent
    },
    {
      path: 'pharmacy/:type',
      component: PahrmacyReportComponent
    },
    {
      path: 'medicine-Delivery-report',
      component: MedicineDeliveryReportComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
