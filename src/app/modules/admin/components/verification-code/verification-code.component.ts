import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { AuthProperties, LoginDetails } from '../../model/login-details';
import { AdminService } from '../../service/admin.service';
import { AthenticationService } from '../../service/athentication.service';

@Component({
  selector: 'app-verification-code',
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.scss']
})
export class VerificationCodeComponent implements OnInit {
  verifyForm: FormGroup
  submitted: boolean = false;
  isVerifiedCode: boolean = false;
  showSendButton : boolean = true;
  routingUrl: string;
  isCodeForResetpwd: boolean = false;
  authProperties: any;
  counter: number ;

  constructor(private f: FormBuilder,
    private loginDetails: LoginDetails,
    private authenticationService: AthenticationService,
    private adminService: AdminService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private activateRouter: ActivatedRoute) {   
      
      let status = this.activateRouter.snapshot.params.root;
      if(!isNullOrUndefined(status))
      {
        if(status == 'signUp') 
        {
          this.isCodeForResetpwd = false;
          this.getLoginDetails();
          if(isNullOrUndefined(this.loginDetails.UserName)) 
          {
            this.router.navigate(['login']); 
          }
        }
        else if (status =='forgetPwt')
        {
          this.showSendButton = false;
          this.isCodeForResetpwd = true;
          this.authProperties = this.authenticationService.getAuthProperties();
          this.loginDetails = this.authProperties.loginDetails;

          if(!this.authProperties.isVerifiedUser) {
            this.router.navigate(['login']); 
          }
        }
        this.startCountdown(600);
      }
      else
      {
        this.router.navigate(['login']); 
      }
  }
 
  ngOnInit() {

    this.verifyForm = this.f.group({
      verificationCode: ['', [Validators.required]]
    });

    // try
    // {
    //   if(this.isCodeForResetpwd)
    //   {
    //      this.loginDetails = this.authenticationService.getAuthProperties().loginDetails;
    //   }
    //   else
    //   {
    //      this.getLoginDetails();
    //   }
    // }
    // catch 
    // {
    //   this.router.navigate(['login']); 
    // } 

    //this.loginDetails = new LoginDetails();
    // this.loginDetails.UserName = "Pathu";
    // this.loginDetails.Email = "ewrdev3@gmail.com"
    // this.loginDetails.Password = "Pathu@123"
    // this.loginDetails.FirstName ="Pathu";
    // this.loginDetails.LastName = "M";
    // this.loginDetails.UserName = "PathuJ" 
  }  

  verifyAccount()
  { 
    if(!this.verifyForm.valid){
      return;
    } 

    let postData = {
      'loginDetails' : this.loginDetails,
      'verificationCode' : this.verifyForm.controls.verificationCode.value
    };

    this.authenticationService.verifyAccount(postData).subscribe(response=> {
      if(response)
      {  
        if(this.isCodeForResetpwd) 
        {
          //this.authenticationService.setAuthProperties(null);
          this.adminService.setLoginDetails(null);
          this.router.navigate(['reset-password']); 
        }
        else 
        {
          this.openSnackBar('User account created successfully. Please contact administrator to activate your account.','');
          this.router.navigate(['login']); 
        }
      }
      else
      {
        //this.isVerifiedCode = true;
        //this.submitted = false;    
        alert('Verification code is invalid');
      }
    });
  }

  sendVerifcationCode(){ 
    this.authenticationService.sendVerificationCode(this.loginDetails).subscribe(response=> {
      if(response == false)
      { 
        this.isVerifiedCode = true;
        this.submitted = false; 
      }
      else
      {
        //this.isInvalidInput = false;       
        //alert('User created successfully..');
        //this.router.navigate(['login']);  
        this.showSendButton = false;
        this.startCountdown(600);
      }
    });
  } 

  getLoginDetails() { 
    this.loginDetails = this.adminService.returLoginDetails();
  } 

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 6000,
    });
  }

  startCountdown(seconds) {
    this.counter = seconds;  
    const interval = setInterval(() => {
      //console.log(this.counter);
      this.counter--;
        
      if (this.counter < 0 ) {
        clearInterval(interval);
        //console.log('Ding!');
        if(this.isCodeForResetpwd){
          this.authenticationService.setAuthProperties(null);
          this.router.navigate(['forgot-password']);
        }
        else{
          this.showSendButton = true; 
        } 
      }
    }, 1000);
  }
}
