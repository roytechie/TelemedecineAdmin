import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessLavel, LoginDetails } from '../../model/login-details';
import { AdminService } from '../../service/admin.service';
import {AthenticationService} from '../../service/athentication.service'

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})


export class LayoutComponent implements OnInit {
  userName: string;
  isAdmin : boolean = false;
  accessValue: AccessLavel = 0;
  constructor(private route: Router,
    private loginDetails: LoginDetails,
    private athenticationService: AthenticationService) 
    {
      if(this.athenticationService.currentUserValue==null) {
        this.route.navigate(['/login']);
      }
      else {
        this.accessValue = this.athenticationService.checkAccessLavel(this.athenticationService.currentUserValue);
      }
      if (this.athenticationService.currentUserValue) { 
        //this.route.navigate(['user/submissions-list']);
        //console.log(this.athenticationService.currentUserValue);
        this.userName = this.athenticationService.currentUserValue.username;
        this.isAdmin = this.athenticationService.currentUserValue.isAdmin;
      }
     }

  ngOnInit() { 
    
  }

  isAccessableTouser(menuCode): boolean {
    let flag: boolean = false;
    let accessData = localStorage.getItem("accessableMenues");
    //console.log(accessData);
    if(accessData) {
      var result: any = JSON.parse(accessData);
      result = result.filter(f=>f.code == menuCode);
      if(result.length > 0){
        flag = true;
      }
    }
    return flag;
  }

  logOut() {
    // remove user from local storage to log user out
    //localStorage.removeItem('currentUser');  
    
    // this.loginDetails.UserName = this.userName;
    // this.loginDetails.UserId = this.athenticationService.currentUserValue.id;

    // this.athenticationService.logOut(this.loginDetails).subscribe(response=>{
    //   this.route.navigate(['/login']);
    // }); 

    this.athenticationService.logOut();
    this.route.navigate(['/login']); 
  } 
}
