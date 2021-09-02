import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AccessLavel } from '../../model/login-details';
import { AdminService } from '../../service/admin.service';
import { AthenticationService } from '../../service/athentication.service';
import * as XLSX from 'xlsx';
import { EditNoteComponent } from './edit-note/edit-note.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pharmacy-report',
  templateUrl: './pharmacy-report.component.html',
  styleUrls: ['./pharmacy-report.component.scss']
})
export class PharmacyReportComponent implements OnInit {
  dataSource?: MatTableDataSource<any> = new MatTableDataSource<any>();
  dataSummary: any;
  displayedColumns: string[] = [ 
  'patientName', 'pharmacyName', 'patientDOB', 'weight','transactionDescription','patientAddress', 'patientState', 
  'phone',  'prescribedDate', 'amount', 'PrescriptionNote', 'prescribedMedicineNames', 'action', 'deliveryNote'];
  endDate: Date = new Date();
  startDate: Date = new Date(new Date().getFullYear(), (new Date().getMonth() -1), new Date().getDate());
  showNoRecordsDiv: boolean = true;
  rowsAdded: boolean = false;
  disabledButton : boolean = false;
  pharmacyList: any;
  pharmacy: any;
  isAdminAccess: boolean = false;
  selectedPharmacyId: number;
  exportButtonDisabled: boolean = true;
  deliveryOperationText: string = "Delivery";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(public adminService: AdminService, private route: Router, 
    private athenticationService: AthenticationService, private dialog: MatDialog) { 
    if(this.athenticationService.currentUserValue==null) {
      this.route.navigate(['/login']);
    }
    else {
      
      let accessValue: AccessLavel = this.athenticationService.checkAccessLavel(this.athenticationService.currentUserValue);
      if(accessValue == AccessLavel.Admin){
        this.isAdminAccess = true;
      }
      else {
        this.selectedPharmacyId = this.athenticationService.currentUserValue.id;
      }
    }
  }

  ngOnInit(): void {
    this.getPharmacyDetails();
    if(this.pharmacy)
    this.disabledButton = true;
  }

  updatePharmacyValue(event: any) {
    this.selectedPharmacyId = event.value.pharmacySequenceId
  }

  getPharmacyDetails() {
    this.adminService.getPharmacyDetails().subscribe(list => {
      
      this.pharmacyList = list;
      if(this.athenticationService.checkAccessLavel(this.athenticationService.currentUserValue) == AccessLavel.Pharmacy){
        let selectedData = this.pharmacyList.filter(response=>{
          return response.pharmacySequenceId == this.athenticationService.currentUserValue.id;
        }); 
        if(selectedData.length > 0){
          this.pharmacy = selectedData[0];
        } 
      }
    }, error => {

    });
  }

  getPharmacyReport() {
    let searchModel = {
      startDate: this.startDate,
      endDate: this.endDate,
      PharmacyId: this.selectedPharmacyId
    }
    console.log(searchModel);
    this.disabledButton = true;
    this.adminService.getPharmacyReport(searchModel).subscribe(response => {
      for(var j in response) {
        response[j].prescribedMedicineNames = response[j].prescribedMedicineNames.replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&le;", "≤")
        .replace("&ge;", "≥")
        .replace('&gt;200lbs', "<200lbs");
     }
      this.exportButtonDisabled = false;
      if(response.length > 0) {
        this.dataSummary = {
          totalAmount: response.map(curr => parseFloat(curr.pharmacyCharges)).reduce(function(a, b)
          {
            return a + b;
          }),
        };
      }
      this.dataSource = new MatTableDataSource<any>(response);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.disabledButton = false;
      if(this.dataSource.data.length > 0){
        this.rowsAdded = true;
        this.showNoRecordsDiv = false;
      }
    });
  }

  applyFilter(event: Event) {
    
    const symptomsFilter = (event.target as HTMLInputElement).value;
    this.dataSource.filter = symptomsFilter.trim().toLowerCase();
  }

  openCompleteDelivery(element) {
    const dialogRef = this.dialog.open(EditNoteComponent, { data : element });
    dialogRef.afterClosed().subscribe(data => {
      this.getPharmacyDetails();
    });
  }

  disableDeliveryOperation (deliveryNote) {
    if (deliveryNote != "") {
      this.deliveryOperationText = "Completed";
      return true;
    }
    else {
      this.deliveryOperationText = "Delivery";
      return false;
    }
  }

  exportexcel() {
    debugger;
    let fileName= 'Pharmacy.xlsx';
    /* table id is passed over here */   
    let readyToExport = this.dataSource.data;

    for(var j in readyToExport) {
      delete readyToExport[j].pharmacyId;
      delete readyToExport[j].submisionId;
      delete readyToExport[j].patientId;
      delete readyToExport[j].amount;
      delete readyToExport[j].pharmacyCharges;
      delete readyToExport[j].submissionType;
      readyToExport[j].prescribedMedicineNames = readyToExport[j].prescribedMedicineNames.replace("&lt;", "<").replace("&gt;", ">").replace("&le;", "≤").replace("&ge;", "≥");
   }
    //var a = JSON.stringify(this.dataSource.data);
    //delete readyToExport["pharmacyId"];
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(readyToExport)
    console.log(readyToExport);
    var header = Object.keys(readyToExport[0]); // columns name

    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // columns length added
        wscols.push({ wch: header[i].length + 5 })
    }
    ws['!cols'] = wscols;
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
     
    /* save to file */  
    XLSX.writeFile(wb, fileName, { bookType: 'xlsx', type: 'buffer' }); 
  }

}
