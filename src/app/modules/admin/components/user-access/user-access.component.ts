import { flatten } from '@angular/compiler';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';
import { AthenticationService } from '../../service/athentication.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.scss']
})
export class UserAccessComponent implements OnInit {

  userTypes: any;
  menues: any[];

  editUserAccessForm = new FormGroup({
    userType: new FormControl('', [Validators.required]),
    menuControl:  new FormControl(''),
 });

  constructor(public adminService: AdminService, private route: Router, 
    private athenticationService: AthenticationService, private dialog: MatDialog, 
    private formBuilder: FormBuilder) { 
      
    }

  ngOnInit(): void {
    this.getUserTypes();
  }

  getUserTypes() {
    this.adminService.getUserTypes().subscribe(data => {
      this.userTypes = data;
    }, error => {});
  }


  
  submitUserAccessForm() {
    let form = this.editUserAccessForm;

    let model = {
      userType: form.value["userType"],
      menues: this.menues
    }
    this.adminService.mapMenuAccessToUser(model).subscribe(data => {
      if(data > 0){
        this.openAlertDialog("Menus are mapped with the user type!");
      }
    }, error => {});
  }

  userTypeChange(event) {
    this.menues = [];
    this.adminService.getSelectedMenuesByUserType(event.value).subscribe(data => {
        this.menues = data;
      }, error => {
  
      });
  }

  menuchange(event) {
    let isCheckedElement = event.target.checked;
    let elementVal = event.target.value;
    if(isCheckedElement) {
      this.menues.find(f => f.code == elementVal).checked = true;
    }
    else {
      this.menues.find(f => f.code == elementVal).checked = false;
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

  public checkError = (controlName: string, errorName: string) => {
    return this.editUserAccessForm.controls[controlName].hasError(errorName);
  }

}
