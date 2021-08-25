import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AccessLavel } from '../../model/login-details';
import { MedicineDetails } from '../../model/medicine-details';
import { AdminService } from '../../service/admin.service';
import { AthenticationService } from '../../service/athentication.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditMedicineComponent } from './edit-medicine/edit-medicine.component';

@Component({
  selector: 'app-medicine',
  templateUrl: './medicine.component.html',
  styleUrls: ['./medicine.component.scss']
})
export class MedicineComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isAdminAccess: boolean = false;
  dataSource: MatTableDataSource<any>;
  categories: any;
  operationId: number = 1;
  isCategoryVisible: boolean = false;
  categoryOp: boolean;
  medicineOp:boolean;
  displayedColumns: string[] = ['medicineId', 'medicineName', 'parentName', 'actions'];

  addEditMedicinForm = new FormGroup({
    medicineName: new FormControl('', [Validators.required]),
    CategoryId: new FormControl('')
 });

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
    }
    
  }

  ngOnInit(): void {
    this.operationId = 1;
    this.isCategoryVisible = false;
    this.getMedicineCategory();
    this.getMedicine();

    this.formTemplateChange(this.operationId);
  }



  getMedicine(): any {
    this.adminService.getMedicine().subscribe(list => {
      
      this.dataSource = new MatTableDataSource<any>(list);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
    },
    error => { 

    });
  }

  getMedicineCategory(): any {
    this.adminService.getMedicineCategories().subscribe(list => {
      
      this.categories = list;
      console.log(list);
    },
    error => {
    });
  }

  addEditMedicine() {
    let form = this.addEditMedicinForm;
    let formData = {
      medicineName: form.value["medicineName"],
      parentId: form.value["CategoryId"]
    };
    this.adminService.insertnedicine(formData).subscribe(res => {
      this.addEditMedicinForm.reset();
      this.openAlertDialog("Record inserted successfully !");
      this.getMedicineCategory();
      this.getMedicine();
    }, error => {

    });
  }

  operationChange(event: any) {
    this.operationId = event.value;
    this.formTemplateChange(event.value);
    this.addEditMedicinForm.reset(); 
  }

  deleteMedicine(medicineId) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure want to send email to all patients?',
        buttonText: {
          ok: 'Send',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const a = document.createElement('a');
        a.click();
        a.remove();
        this.adminService.DeleteMedicineDetails(medicineId).subscribe(response => {
          this.getMedicineCategory();
          this.getMedicine();
          if(response == 1){
            //this.emailForm.reset();
            this.openAlertDialog("Record deleted successfully !");
          }
          else if(response > 1){
            this.openAlertDialog("One or more medicine(s) are associated with this category. Error to delete !!");
          }
          else{
            this.openAlertDialog("error occurred during mail send.");
          }
          
        },
        error =>{
          console.log("error occurred duringthe operation")
        });
      }
    });
  }

  formTemplateChange(operationId) {
    if(operationId == 1) {
      this.addEditMedicinForm.get('CategoryId').setValidators(Validators.required);
      this.categoryOp = false;
      this.medicineOp = true;
      this.isCategoryVisible = true;
    }
    else {
      this.addEditMedicinForm.get('CategoryId').setValidators([]);
      this.categoryOp = false;
      this.medicineOp = true;
      this.isCategoryVisible = false;
    }
  }

  openEditForm(element) {
    const dialogRef = this.dialog.open(EditMedicineComponent, { data : element });
    dialogRef.afterClosed().subscribe(data => {
      this.getMedicineCategory();
      this.getMedicine();
    });
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

}
