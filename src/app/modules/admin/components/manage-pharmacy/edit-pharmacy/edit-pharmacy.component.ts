import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { AthenticationService } from '../../../service/athentication.service';
import { AlertDialogComponent } from '../../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-edit-pharmacy',
  templateUrl: './edit-pharmacy.component.html',
  styleUrls: ['./edit-pharmacy.component.scss']
})
export class EditPharmacyComponent implements OnInit {
  
  disableInEditMode: boolean = false;
  submitButtonText: string = "Submit";
  userTypes: any;
  editPharmacyForm = new FormGroup({
    PharmacyName: new FormControl('', [Validators.required]),
    LoginUserName: new FormControl('', [Validators.required]),
    PharmacyContactNum: new FormControl('', [Validators.required, Validators.maxLength(10), 
      Validators.minLength(10), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
    PharmacyEmailAddress: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
    PharmacyAddress: new FormControl(''),
    PharmacyCity: new FormControl(''),
    PharmacyState: new FormControl(''),
    PharmacyFax: new FormControl(''),
    PharmacyZipCode: new FormControl(''),
    PharmacyCountry: new FormControl(''),
    PharmacyPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    userType: new FormControl('', [Validators.required]),
 });

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public adminService: AdminService, private route: Router, 
  private athenticationService: AthenticationService, private dialog: MatDialog, public dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
    this.dialogRef.updateSize("70%");
    this.dialogRef.disableClose = true;

    this.adminService.getUserTypes().subscribe(data => {
      this.userTypes = data;
    }, error => {});

    if(this.data != null && this.data.element != null && this.data.element.userId > 0) {
      this.disableInEditMode = true;
      this.submitButtonText = "Update";
      this.adminService.GetPharmacyUserLoginDetailsById(this.data.element.userId).subscribe(data => {
        console.log(data);
        this.editPharmacyForm.setValue({
          PharmacyName: data.pharmacyName, 
          LoginUserName: data.loginUserName, 
          PharmacyContactNum: data.pharmacyContactNum, 
          PharmacyEmailAddress: data.pharmacyEmailAddress, 
          PharmacyAddress: data.pharmacyAddress, 
          PharmacyCity: data.pharmacyCity, 
          PharmacyState: data.pharmacyState, 
          PharmacyFax: data.pharmacyFax, 
          PharmacyZipCode: data.pharmacyZipCode, 
          PharmacyCountry: data.pharmacyCountry,
          PharmacyPassword: data.pharmacyPassword,
          userType: data.accessLavel
        });
      }, error => {

      });
      
    }
  }

  submitPharmacyForm() {
    console.log(this.data.pharmacyList.map(m=> m.loginUserName));
    let form = this.editPharmacyForm;
    
    let PSId = 0;
    let UId = 0;
    let operationMessage = "Data inserted successfully!";
    if(this.data != null && this.data.element != null && this.data.element.userId > 0) {
      UId = this.data.element.userId;
      operationMessage = "Data updated successfully!";
    }
    let pharmacyModel = {
      pharmacySequenceId: PSId,
      userId: UId,
      pharmacyName: form.value['PharmacyName'],
      loginUserName: form.value['LoginUserName'],
      pharmacyContactNum: form.value['PharmacyContactNum'],
      pharmacyEmailAddress: form.value['PharmacyEmailAddress'],
      pharmacyAddress: form.value['PharmacyAddress'],
      pharmacyCity: form.value['PharmacyCity'],
      pharmacyState: form.value['PharmacyState'],
      pharmacyFax: form.value['PharmacyFax'],
      pharmacyZipCode: form.value['PharmacyZipCode'],
      pharmacyCountry: form.value['PharmacyCountry'],
      PharmacyPassword: form.value['PharmacyPassword'],
      accessLavel: form.value['userType']
   };

   if(UId <= 0){
    if(this.isInArray(form.value['LoginUserName'], this.data.pharmacyList.map(m=> m.loginUserName))){
      this.openAlertDialog("Entered user name already exists.");
      return false;
    }
  }

   this.adminService.insertUpdatePharmacyLoginDetails(pharmacyModel).subscribe(data => {
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
    console.log(this.data.pharmacyList.map(m=> m.loginUserName));
    if(!this.disableInEditMode) {
      console.log(event.target.value);
      let isExist = this.isInArray(event.target.value, this.data.pharmacyList.map(m=> m.loginUserName));
      if(isExist) {
        this.openAlertDialog("Entered user name already exists.");
      }
    }
  }

  isInArray(value, array) {
    return array.indexOf(value) > -1;
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.editPharmacyForm.controls[controlName].hasError(errorName);
  }

}
