import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { AthenticationService } from '../../../service/athentication.service';
import { AlertDialogComponent } from '../../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-edit-promocode',
  templateUrl: './edit-promocode.component.html',
  styleUrls: ['./edit-promocode.component.scss']
})
export class EditPromocodeComponent implements OnInit {
  
  disableInEditMode: boolean = false;
  submitButtonText: string = "Submit";
  userTypes: any;
  editPromocodeForm = new FormGroup({
    PromocodeName: new FormControl('', [Validators.required]),
    PromocodePercent: new FormControl('', [Validators.required]),
    PromocodeStartDate: new FormControl('', [Validators.required]),
    PromocodeEndDate: new FormControl('', [Validators.required]),
    PromocodeIsActive: new FormControl(''),
 });

//  startDate: Date = new Date();
//  endDate : Date = new Date();


  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public adminService: AdminService, private route: Router, 
  private athenticationService: AthenticationService, private dialog: MatDialog, public dialogRef: MatDialogRef<any>,private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.dialogRef.updateSize("70%");
    this.dialogRef.disableClose = true;

    // this.adminService.getUserTypes().subscribe(data => {
    //   this.userTypes = data;
    // }, error => {});

    if(this.data != null && this.data.element != null && this.data.element.promocodeId > 0) {
      this.disableInEditMode = true;
      this.submitButtonText = "Update";
      this.adminService.GetPromocodeDetailsById(this.data.element.promocodeId).subscribe(data => {
        console.log(data);
        this.editPromocodeForm.setValue({
          PromocodeName: data.promocodeName, 
          PromocodePercent: data.promocodePercent, 
          PromocodeStartDate: data.promocodeStartDate, 
          PromocodeEndDate: data.promocodeEndDate, 
          PromocodeIsActive: data.promocodeIsActive
        });
      }, error => {

      });
      
    }
  }

  submitPromocodeForm() {
      //console.log(this.data.pharmacyList.map(m=> m.loginUserName));
      let form = this.editPromocodeForm;
    
      let PromoId = 0;
      // let UId = 0;
      let operationMessage = "Data inserted successfully!";
      if(this.data != null && this.data.element != null && this.data.element.promocodeId > 0) {
        PromoId = this.data.element.promocodeId;
        operationMessage = "Data updated successfully!";
      }
    
      let promocodeModel = {
        PromocodeId: PromoId,
        PromocodeName: form.value['PromocodeName'],
        PromocodePercent: parseFloat(form.value['PromocodePercent']),
        PromocodeIsActive: Boolean(form.value['PromocodeIsActive']),
        // PromocodeStartDate: this.adminService.returnFormatedDate(form.value['PromocodeStartDate']),
        // PromocodeEndDate: this.adminService.returnFormatedDate(form.value['PromocodeEndDate'])

        PromocodeStartDate: this.datepipe.transform(form.value['PromocodeStartDate'], 'yyyy-MM-dd'),
        PromocodeEndDate: this.datepipe.transform(form.value['PromocodeEndDate'], 'yyyy-MM-dd')
      };

      // if(PromoId <= 0){
      //   if(this.isInArray(form.value['PromocodeName'], this.data.pharmacyList.map(m=> m.loginUserName))){
      //     this.openAlertDialog("Entered user name already exists.");
      //     return false;
      //   }
      // }

      this.adminService.insertUpdatePromocodeDetails(promocodeModel).subscribe(data => {
        if(data == 1){
            this.closeDialog();
            this.openAlertDialog(operationMessage);
        }
        else {
          alert('error occurred.');
        }
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

  disallowSpace(event) {
    return event.keyCode != 32 ? event:event.preventDefault();
  }

  ckeckExistingUserName(event) {
    console.log(this.data.promocodeList.map(m=> m.loginUserName));
    if(!this.disableInEditMode) {
      console.log(event.target.value);
      let isExist = this.isInArray(event.target.value, this.data.promocodeList.map(m=> m.promocodeName));
      if(isExist) {
        this.openAlertDialog("Entered user name already exists.");
      }
    }
  }

  isInArray(value, array) {
    return array.indexOf(value) > -1;
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.editPromocodeForm.controls[controlName].hasError(errorName);
  }

}
