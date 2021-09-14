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
import { PharmaPayComponent } from './pharma-pay/pharma-pay.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-pharmacy-report',
  templateUrl: './pharmacy-report.component.html',
  styleUrls: ['./pharmacy-report.component.scss']
})
export class PharmacyReportComponent implements OnInit {
  dataSource?: MatTableDataSource<any> = new MatTableDataSource<any>();
  getPharmacyResponse: any;
  dataSummary: any;
  displayedColumns: string[] = [ 
  'patientName', 'pharmacyName', 'patientDOB', 'weight','transactionDescription','patientAddress', 'patientState', 
  'phone',  'prescribedDate', 'amount', 'PrescriptionNote', 'prescribedMedicineNames', 'medicationAllergies', 'action', 'pharmaPayNote'];
  endDate: Date = new Date();
  startDate: Date = new Date(new Date().getFullYear(), (new Date().getMonth()), new Date().getDate());
  showNoRecordsDiv: boolean = true;
  rowsAdded: boolean = false;
  disabledButton : boolean = false;
  pharmacyList: any;
  pharmacy: any;
  isAdminAccess: boolean = false;
  selectedPharmacyId: number;
  selectedPharmacyName: string;
  displaySelectedFharmaName: string;
  exportButtonDisabled: boolean = true;
  deliveryOperationText: string = "Delivery";
  outstandingAmountToPay: number = 0;
  deliveredRecords: any;
  deliveryDefaultStatus: number = 0;
  pharmaPaidDefaultStatus: number = 0;
  disablePharmaPaidStatus: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(public adminService: AdminService, private route: Router, 
    private athenticationService: AthenticationService, private dialog: MatDialog) { 
    if(this.athenticationService.currentUserValue==null) {
      this.route.navigate(['/login']);
    }
    else {
      
      let accessableMenues = JSON.parse(localStorage.getItem("accessableMenues"));
        if(accessableMenues) {
          this.selectedPharmacyId = this.athenticationService.currentUserValue.id;
          if(accessableMenues.filter(f => f.code == 10).length <= 0) {
            this.route.navigate(['/login']);
          }
          else {
            if(accessableMenues.filter(f => f.code == 10)[0].userTypeCode == 1  || accessableMenues.filter(f => f.code == 10)[0].userTypeCode == 0) {
              this.isAdminAccess = true;
            }
          }
        }
        else {
          this.route.navigate(['/login']);
        }
    }
  }

  ngOnInit(): void {
    this.getPharmacyDetails();
    if(this.pharmacy)
    this.disabledButton = true;
  }

  updatePharmacyValue(event: any) {
    this.selectedPharmacyId = event.value.pharmacySequenceId;
    this.selectedPharmacyName = event.source.triggerValue;

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
    this.pharmaPaidDefaultStatus = 0;
    this.deliveryDefaultStatus = 0;
    this.adminService.getPharmacyReport(searchModel).subscribe(response => {
      for(var j in response) {
        response[j].prescribedMedicineNames = response[j].prescribedMedicineNames.replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&le;", "≤")
        .replace("&ge;", "≥")
        .replace('&gt;200lbs', "<200lbs");
     }
      this.exportButtonDisabled = false;
      this.calculateTableSummary(response);
      //outstanding amount calculatetion.
      if(response.length > 0) {
        this.deliveredRecords = response.filter(function(item) {
          return (item.deliveryDate != "" || item.deliveryNote != "") && (item.pharmaPayNote == "");
        });

        if(this.deliveredRecords && this.deliveredRecords.length > 0) {
          this.outstandingAmountToPay = this.deliveredRecords
          .map(curr => parseFloat(curr.pharmacyCharges))
          .reduce(function(a, b) { return a + b; })
        }
        else {
          this.outstandingAmountToPay = 0;
        }
        
      }
      else {
        this.outstandingAmountToPay = 0;
      }
      this.getPharmacyResponse = response;
      this.dataSource = new MatTableDataSource<any>(response);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.disabledButton = false;
      this.displaySelectedFharmaName = this.selectedPharmacyName;
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

  openPharmacyToPay() {
    if(this.outstandingAmountToPay > 0) {
      const dialogRef = this.dialog.open(PharmaPayComponent, { data : this.deliveredRecords });
      dialogRef.afterClosed().subscribe(data => {
       // alert();
        this.getPharmacyReport();
      });
    }
    else {
      this.openAlertDialog("There is no outstanding to pay");
    }
    
  }

  openAlertDialog(alertMessage: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        message: alertMessage,
        buttonText: {
          cancel: 'OK'
        }
      },
    });
  }

  openCompleteDelivery(element) {
    const dialogRef = this.dialog.open(EditNoteComponent, { data : element });
    dialogRef.afterClosed().subscribe(data => {
     // alert();
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

  filterByDeciveryStatus(event) {
    this.dataSource.data = this.getPharmacyResponse;
    this.disablePharmaPaidStatus = true;

    if(event.value == 1) {
      this.dataSource.data = this.dataSource.filteredData.filter(function(item) {
        return (item.deliveryDate == "" && item.deliveryNote == "");
      });
    }
    else if(event.value == 2) {
      //active pharma pay filter
      this.disablePharmaPaidStatus = false;
      this.dataSource.data = this.dataSource.filteredData.filter(function(item) {
        return (item.deliveryDate != "" || item.deliveryNote != "");
      });
    }

    this.calculateTableSummary(this.dataSource.data);
  }

  filterByPharmacyPay (event) {
    if(event.value == 1) {
      this.dataSource.data = this.dataSource.filteredData.filter(function(item) {
        return (item.pharmaPayNote != "");
      });
    }
    else if(event.value == 2) {
      this.dataSource.data = this.dataSource.filteredData.filter(function(item) {
        return (item.pharmaPayNote == "");
      });
    }
  }

  calculateTableSummary(data) {
    console.log(data);
    if(data && data.length > 0) {
      this.dataSummary = {
        totalAmount: data.map(curr => parseFloat(curr.pharmacyCharges)).reduce(function(a, b)
        {
          return a + b;
        }),
      };
    }
    else {
      this.dataSummary = {
        totalAmount: 0,
      };
    }
    
  }

  exportexcel() {
    debugger;
    let fileName= 'Pharmacy.xlsx';
    /* table id is passed over here */   
    let readyToExport = this.dataSource.data;

    for(var j in readyToExport) {
      //delete readyToExport[j].pharmacyId;
      //delete readyToExport[j].submisionId;
      //delete readyToExport[j].patientId;
      delete readyToExport[j].amount;
      delete readyToExport[j].procedureCharges;
      delete readyToExport[j].submissionType;
      readyToExport[j].prescribedMedicineNames = readyToExport[j].prescribedMedicineNames.replace("&lt;", "<").replace("&gt;", ">").replace("&le;", "≤").replace("&ge;", "≥");
   }
    //var a = JSON.stringify(this.dataSource.data);
    //delete readyToExport["pharmacyId"];
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(readyToExport);

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
