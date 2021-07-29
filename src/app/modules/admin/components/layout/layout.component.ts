import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDetails } from '../../model/login-details';
import {AthenticationService} from '../../service/athentication.service'

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  userName: string;
  isAdmin : boolean = false;
  constructor(private route: Router,
    private loginDetails: LoginDetails,
    private athenticationService: AthenticationService) 
    { 
      if (this.athenticationService.currentUserValue) { 
        //this.route.navigate(['user/submissions-list']);
        //console.log(this.athenticationService.currentUserValue);
        this.userName = this.athenticationService.currentUserValue.username;
        this.isAdmin = this.athenticationService.currentUserValue.isAdmin;
      }
     }

  ngOnInit() { 
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
