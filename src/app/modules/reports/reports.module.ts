import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PahrmacyReportComponent } from './component/pahrmacy-report/pahrmacy-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { RefillComponent } from './component/refill/refill.component';
import { ReferralsComponent } from './component/referrals/referrals.component';

@NgModule({
  declarations: [PahrmacyReportComponent, RefillComponent, ReferralsComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ]
})
export class ReportsModule { }
