import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReportRequest } from '../../model/login-details';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.scss']
})
export class PaymentReportComponent implements OnInit { 
  patientsList: any;

  rowsAdded: boolean = false;
  isTodayList: boolean = false;
  
  displayedColumns: string[] = ['firstName', 'lastName', 
    'paymentTime', 'authTranId', 'paymentAmount'];

  startDate: Date = new Date();
  endDate: Date = new Date();
  disabledButton : boolean = false;
  showNoRecordsDiv: boolean = false;

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private adminService: AdminService,
    private reportRequest: ReportRequest) { }

  ngOnInit() {
    this.showNoRecordsDiv = false;
    //this.getPatientsList(this.isTodayList);
  } 

  getPatientsList(isTodayList: boolean)
  { 
    //var newEndDate : Date = this.endDate; 
    if(isTodayList)
    {
      this.startDate = new Date();
      //newEndDate.setDate(this.startDate.getDate() + 1);
      this.endDate = new Date(); //newEndDate;
    }
    else
    {
      //newEndDate.setDate( newEndDate.getDate() + 1 ) 
    }  
    this.disabledButton = true;

    this.reportRequest.startDate = this.adminService.returnFormatedDate(this.startDate);
    this.reportRequest.endDate = this.adminService.returnFormatedDate(this.endDate);;
    this.reportRequest.isAdmin = JSON.parse(localStorage.currentUser).isAdmin;
    this.reportRequest.userId = JSON.parse(localStorage.currentUser).id;
    this.reportRequest.isSingleSubmission = false;
    this.reportRequest.reportType = 'Payment';

    this.adminService.getPatientsList(this.reportRequest).subscribe(response=>{
      this.patientsList = response; 
      this.dataSource = new MatTableDataSource<any>(this.patientsList); // [...this.patientsList];
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.rowsAdded = this.dataSource.data.length > 0; 
      this.disabledButton = false; 
      this.showNoRecordsDiv = true; 
    }); 
  } 
}
