import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ViewSubmissionComponent } from 'src/app/modules/admin/components/view-submission/view-submission.component';
import { AccessLavel, ReportRequest } from 'src/app/modules/admin/model/login-details';
import { AdminService } from 'src/app/modules/admin/service/admin.service';
import { AthenticationService } from 'src/app/modules/admin/service/athentication.service';
import { ChangePharmacyComponent } from './change-pharmacy/change-pharmacy.component';

@Component({
  selector: 'app-medicine-delivery-report',
  templateUrl: './medicine-delivery-report.component.html',
  styleUrls: ['./medicine-delivery-report.component.scss']
})
export class MedicineDeliveryReportComponent implements OnInit {

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'phone', 'email', 'address', 'state','package' ,'amount', 'paymentDate', 'actions'];

  dataSource = new MatTableDataSource<any>();
  data: Observable<any>;
  showNoRecordsDiv: boolean = false;
  disabledButton : boolean = false;
  startDate: Date = new Date();
  endDate: Date = new Date();
  maxDate: Date = new Date();
  isTodayList : boolean = false;
  rowsAdded: boolean = false;
  JSON: any;
  pharmacyList: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort; 
  //@ViewChild(ListSubmissionsComponent) childListComponent: ListSubmissionsComponent; 
  fileName= 'ExcelSheet.xlsx';
  
  constructor(public adminService: AdminService,
    private reportRequest: ReportRequest, private route: Router, 
    private athenticationService: AthenticationService,
    private dialog: MatDialog, private datepipe: DatePipe) {
      if(this.athenticationService.currentUserValue==null) {
        this.route.navigate(['/login']);
      }
      else{
        let accessValue: AccessLavel = this.athenticationService.checkAccessLavel(this.athenticationService.currentUserValue);
        if(accessValue != AccessLavel.Admin) {
          this.route.navigate(['/login']);
        }
      }
     }

  ngOnInit(): void {
    this.showNoRecordsDiv = false;
    this.getPharmacyDetails();
    console.log(this.dataSource);
  }

  getMedicineDeliveryReport() {
    this.disabledButton = true;
    let deliverySearchModel = {
      startData: this.startDate,
      endDate: this.endDate
    };
    
    this.adminService.GetMedicineDeliveryReport(deliverySearchModel).subscribe(response => {
      console.log(response);
      this.dataSource = new MatTableDataSource<any>(response);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.showNoRecordsDiv = true;
      this.disabledButton = false;
      this.rowsAdded = this.dataSource.data.length > 0;
    }, error => {});
  }

  applyFilter(event) {

  }

  exportToExcel() {

  }

  getPatientsList() {

  }

  getPharmacyDetails() {
    this.adminService.getPharmacyDetails().subscribe(data => {
      this.pharmacyList = data;
    }, error => {
      
    });
  }

  addEditPharmacy(event, element) {
    let pharmacyData = {
      selectedPharmacy: {
        text: event.source.triggerValue,
        value: event.value,
      },
      selectedElement: element
    };
    console.log(event.source.triggerValue);
    const dialogRef = this.dialog.open(ChangePharmacyComponent, { data : pharmacyData });
    dialogRef.afterClosed().subscribe(data => {

      this.getMedicineDeliveryReport();
      //this.getMedicineCategory();
      //this.getMedicine();
    });
  }

  openViewSubmission(element) {

    this.reportRequest.startDate = this.datepipe.transform(this.startDate, 'yyyy-MM-dd'),
    this.reportRequest.endDate = this.datepipe.transform(this.endDate, 'yyyy-MM-dd'),
    this.reportRequest.isAdmin = true,
    this.reportRequest.isSingleSubmission = true;
    this.reportRequest.reportType = 'Submission',
    this.reportRequest.submissionId = element.submissionId,
    this.reportRequest.userId = 1

    console.log(this.reportRequest);

    this.adminService.getPatientsList(this.reportRequest).subscribe(response => {

      localStorage.patiantData = JSON.stringify(response[0]); 
      let medicineDeliveryData = { response: response[0], modalViewType: 'medicineDeliveryReport' }
      const dialogRef = this.dialog.open(ViewSubmissionComponent, { data : medicineDeliveryData });

      dialogRef.afterClosed().subscribe(result => { 
        //this.getMedicineDeliveryReport();
      });
    });  



    }

}
