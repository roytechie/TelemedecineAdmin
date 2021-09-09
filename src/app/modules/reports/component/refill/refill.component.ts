import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ListSubmissionsComponent } from 'src/app/modules/admin/components/list-submissions/list-submissions.component';
import { AccessLavel, ReportRequest } from 'src/app/modules/admin/model/login-details';
import { AdminService } from 'src/app/modules/admin/service/admin.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver' 
import { Router } from '@angular/router';
import { AthenticationService } from 'src/app/modules/admin/service/athentication.service';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-refill',
  templateUrl: './refill.component.html',
  styleUrls: ['./refill.component.scss']
})
export class RefillComponent implements OnInit {
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'phone', 'city', 'state', 'paymentTime'];

  dataSource = new MatTableDataSource<any>();
  showNoRecordsDiv: boolean = false;
  disabledButton : boolean = false;
  startDate: Date = new Date();
  endDate: Date = new Date();
  maxDate: Date = new Date();
  isTodayList : boolean = false;
  rowsAdded: boolean = false;
  JSON: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort; 
  @ViewChild(ListSubmissionsComponent) childListComponent: ListSubmissionsComponent; 
  fileName= 'ExcelSheet.xlsx';

  constructor(public adminService: AdminService,
    private reportRequest: ReportRequest, private route: Router, private athenticationService: AthenticationService) { 
      if(this.athenticationService.currentUserValue==null) {
        this.route.navigate(['/login']);
      }
      else{
        let accessableMenues = JSON.parse(localStorage.getItem("accessableMenues"));
        if(accessableMenues) {
          if(accessableMenues.filter(f => f.code == 7).length <= 0) {
            this.route.navigate(['/login']);
          }
        }
        else {
          this.route.navigate(['/login']);
        }
      }
      
      this.JSON = JSON;
    }

  ngOnInit(): void {
    this.showNoRecordsDiv = false;
  }

  // getStatusDetails(input : any){
  //   return this.stausOptions.options.filter(function(item) { 
  //     return  (item.value == input);
  // });
  // }


  // this.dataSource = new MatTableDataSource<any>(this.patientsList); // [...this.patientsList];
  // setTimeout(() => this.dataSource.paginator = this.paginator);
  // setTimeout(() => this.dataSource.sort = this.sort);
  // this.rowsAdded = this.dataSource.data.length > 0;  

  getPatientsList() {
    // var newEndDate : Date = this.endDate; 
    // this.isTodayList = false;
    // if(this.isTodayList)
    // {
    //   this.startDate = new Date();
    //   newEndDate.setDate(this.startDate.getDate() + 1);
    //   this.endDate = newEndDate;
    // }
    // else
    // { 
    //   newEndDate.setDate( this.startDate.getDate() + 1 ) 
    // } 

    //var endDate = new Date(this.startDate);
    //endDate.setDate( this.startDate.getDate() + 1 );  
    this.reportRequest.startDate = this.adminService.returnFormatedDate(this.startDate); 
    this.reportRequest.endDate =this.adminService.returnFormatedDate(this.endDate);
    this.reportRequest.isAdmin = JSON.parse(localStorage.currentUser).isAdmin;
    this.reportRequest.userId = JSON.parse(localStorage.currentUser).id;
    this.reportRequest.isSingleSubmission = false;
    this.disabledButton = true;

    this.adminService.getRefills(this.reportRequest).subscribe(response => { 
      this.dataSource = new MatTableDataSource<any>(response);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.showNoRecordsDiv = true;
      this.disabledButton = false;
      this.rowsAdded = this.dataSource.data.length > 0;  
      
    })
    //this.dataSource = this.childListComponent.getPatientsList(false, true);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

//   public exportAsExcelFile(json: any[], excelFileName: string): void {
//     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
//     const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
//     const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     this.saveAsExcelFile(excelBuffer, excelFileName);
//   }

//   private saveAsExcelFile(buffer: any, fileName: string): void {
//     const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
//     FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
//  }
}
