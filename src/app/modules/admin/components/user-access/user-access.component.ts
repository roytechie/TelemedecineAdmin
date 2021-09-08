import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';
import { AthenticationService } from '../../service/athentication.service';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.scss']
})
export class UserAccessComponent implements OnInit {

  userTypes: any;
  menues: any[];
  selectedMenues: any;
  checkedMenues: any[] = [];

  editUserAccessForm = new FormGroup({
    userType: new FormControl('', [Validators.required]),
    menuControl:  new FormControl(),
 });

  constructor(public adminService: AdminService, private route: Router, 
    private athenticationService: AthenticationService, private dialog: MatDialog) { 
      
    }

  ngOnInit(): void {
    this.getUserTypes();
    //this.getMenues();
  }

  getUserTypes() {
    this.adminService.getUserTypes().subscribe(data => {
      this.userTypes = data;
    }, error => {});
  }

  // getMenues() {
  //   this.menues = [];
  //   this.adminService.getMenues().subscribe(data => {
  //     if(data && data.length > 0) {
  //       data.forEach(f => {
  //         this.menues.push({name: f.name, code: f.code, checked: false});
  //       });
  //     }
  //   }, error => {});
  // }

  submitUserAccessForm() {

  }

  userTypeChange(event) {
    this.adminService.getSelectedMenuesByUserType(event.value).subscribe(data => {
      console.log(data);
        this.menues = data;
        
      }, error => {
  
      });
  }

  updateAllComplete() {
    
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.editUserAccessForm.controls[controlName].hasError(errorName);
  }

}
