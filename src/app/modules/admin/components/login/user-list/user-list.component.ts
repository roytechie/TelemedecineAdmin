import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatRadioChange } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AccessLavel, LoginDetails } from '../../../model/login-details';
import { AdminService } from '../../../service/admin.service';
import { AthenticationService } from '../../../service/athentication.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['firstName', 'lastName', 'userName', 'email', 'phoneNo','userId', 'isActive']; // 'userId', 'isActive'];
  dataSource: any = [];
  usersList: any = [];
  isActiveUser: boolean = false; 
  isLoading: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: Router, private adminService: AdminService,
    private loginDetails: LoginDetails,
    private athenticationService: AthenticationService,
    private _snackBar: MatSnackBar) { 
      if(this.athenticationService.currentUserValue==null) {
        this.route.navigate(['/login']);
      } 
      else {
        let accessableMenues = JSON.parse(localStorage.getItem("accessableMenues"));
        if(accessableMenues) {
          if(accessableMenues.filter(f => f.code == 3).length <= 0) {
            this.route.navigate(['/login']);
          }
        }
        else {
          this.route.navigate(['/login']);
        }
      }
      if (this.athenticationService.currentUserValue) { 
        //this.route.navigate(['user/submissions-list']);
        //console.log(this.athenticationService.currentUserValue);
        this.loginDetails.AdminUserName = this.athenticationService.currentUserValue.username; 
        this.loginDetails.AdminUserId = this.athenticationService.currentUserValue.id;
      }
     }

  ngOnInit() {
    this.getUsersList();
  } 
  
  getUsersList() 
  { 
    let sortingOrder ='userId';
    this.isLoading = true;
    this.adminService.getUserDetails(sortingOrder).subscribe(response=>{
      this.usersList = response;
      
      this.dataSource = new MatTableDataSource<any>(this.usersList); // [...this.patientsList];
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      //this.rowsAdded = this.dataSource.data.length > 0; 
      this.isLoading = false;
    }); 
  }

  updateUserAccess(element: any, status: MatRadioChange)
  { 
    this.loginDetails.UserId = element.userId;
    this.loginDetails.isActiveUser = status.value;
    this.loginDetails.UserName = element.userName;
    this.loginDetails.FirstName = element.firstName;
    this.loginDetails.LastName = element.lastName;
    this.loginDetails.Email = element.email;  

    this.adminService.updateUserDetails(this.loginDetails).subscribe(response=>{

      let alertString = '';
      if(this.loginDetails.isActiveUser)
      {
        alertString = 'User activated successfully';
      }
      else 
      {
        alertString = 'User deactivated successfully';
      }
      this.openSnackBar(alertString,'');
    });  
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  } 
}
