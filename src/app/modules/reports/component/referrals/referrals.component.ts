import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ListSubmissionsComponent } from 'src/app/modules/admin/components/list-submissions/list-submissions.component';
import { ReportRequest } from 'src/app/modules/admin/model/login-details';
import { AdminService } from 'src/app/modules/admin/service/admin.service';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver' 

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent implements OnInit {
  displayedColumns: string[] = ['referralName','fullLink','ranking','noOfReferance'];

  dataSource = new MatTableDataSource<any>();  
  showNoRecordsDiv: boolean = false;
  rowsAdded: boolean = false;
  startDate: Date = new Date();
  endDate: Date = new Date();
  maxDate: Date = new Date();
  JSON: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort; 
  fileName= 'ExcelSheet.xlsx';
  constructor(
    public adminService: AdminService,
    private reportRequest: ReportRequest) {
      this.JSON = JSON;
     }

  ngOnInit(): void {
    this.showNoRecordsDiv = false;
  }

  exportToExcel(): void
  {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName); 
  }
  getPatientsList() {  
    this.reportRequest.startDate = this.adminService.returnFormatedDate(this.startDate); 
    this.reportRequest.endDate =this.adminService.returnFormatedDate(this.endDate);
    this.reportRequest.isAdmin = JSON.parse(localStorage.currentUser).isAdmin;
    this.reportRequest.userId = JSON.parse(localStorage.currentUser).id;
    this.reportRequest.isSingleSubmission = false;

    this.adminService.getReferrals(this.reportRequest).subscribe(response => { 
    this.dataSource = new MatTableDataSource<any>(response);
      console.log(this.dataSource);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.showNoRecordsDiv = true;
      this.rowsAdded = this.dataSource.data.length > 0;    
    })
  }

}
