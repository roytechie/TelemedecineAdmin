import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { AthenticationService } from '../../../service/athentication.service';
import { AlertDialogComponent } from '../../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-edit-medicine',
  templateUrl: './edit-medicine.component.html',
  styleUrls: ['./edit-medicine.component.scss']
})
export class EditMedicineComponent implements OnInit {


  isAdminAccess: boolean = false;
  dataSource: MatTableDataSource<any>;
  categories: any;
  operationId: number = 1;
  isCategoryVisible: boolean = false;
  editData: any;

  addEditMedicinForm = new FormGroup({
    medicineName: new FormControl('', [Validators.required]),
    CategoryId: new FormControl('')
 });

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public adminService: AdminService, private route: Router, 
  private athenticationService: AthenticationService, private dialog: MatDialog, public dialogRef: MatDialogRef<any>) { 
    this.isCategoryVisible = true;
  }

  ngOnInit(): void {

    console.log(this.data)
    this.dialogRef.updateSize("70%");
    if(this.data.parentId == 0) {
      this.isCategoryVisible = false;
    }
    this.dialogRef.disableClose = true;
    this.getMedicineCategory();
    this.getMedicineById(this.data.medicineId);
  }

  getMedicineCategory(): any {
    this.adminService.getMedicineCategories().subscribe(list => {
      
      this.categories = list;
      console.log(list);
    },
    error => {
    });
  }

  getMedicineById(medicineId): any {
    this.adminService.getMedicineById(medicineId).subscribe(list => {
      this.editData = list;
      this.addEditMedicinForm.controls['medicineName'].setValue(list.medicineName);
      this.addEditMedicinForm.controls['CategoryId'].setValue(list.parentId);
    },
    error => { 

    });
  }

  addEditMedicine() {
    console.log();
    let form = this.addEditMedicinForm;
    let formData = {
      medicineName: form.value["medicineName"],
      parentId: form.value["CategoryId"],
      medicineId: this.data.medicineId
    };
    this.adminService.UpdateMedicineDetails(formData).subscribe(res => {
      this.addEditMedicinForm.reset();
      this.closeDialog();
      this.openAlertDialog("Record updated successfully !");
    }, error => {

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

  closeDialog() {
    this.dialogRef.close();
  }

  operationChange(event) {

  }

}
