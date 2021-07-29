import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AthenticationService } from '../../../service/athentication.service';
import { LoginDetails } from '../../../model/login-details';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from '../../../service/confirm-validator';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup
  hide = true;
  resetPassword: string = '';
  userId : any;
  
  constructor(private athenticationService: AthenticationService,
    private fb: FormBuilder,
    public loginDetails: LoginDetails,
    private route: Router,
    private activatedRoute: ActivatedRoute) 
    {
      try 
      {
        this.loginDetails = this.athenticationService.getAuthProperties().loginDetails;
        if(isNullOrUndefined(this.loginDetails)){
          this.route.navigate(['login']);
        }
      }
      catch 
      {
        this.route.navigate(['login']);
      }   

      //this.userId = this.activatedRoute.snapshot.params.id; 
      //alert(this.userId);
      
      //if(isNullOrUndefined(localStorage.IsVerified) || isNullOrUndefined(this.userId))
      //{
      //  this.athenticationService.openSnackBar('Unauthorized access!', 2000)
      //  this.route.navigate(['forgot-password']);
      //}
    }

  ngOnInit() {
    this.resetPasswordForm = this.fb.group(
      {
          Password: ['', Validators.required],
          ConfirmPassword:  ['', Validators.required]
      },
      { 
          validators: MustMatch('Password','ConfirmPassword')
      });
  }

  get f() { return this.resetPasswordForm.controls }

  updatePassword(){
    if(this.resetPasswordForm.invalid) return;

    if(this.resetPasswordForm.controls.Password.value != 
      this.resetPasswordForm.controls.ConfirmPassword.value){
    }
    
    this.loginDetails.Password = this.resetPasswordForm.controls.Password.value;
    //this.loginDetails.UserId = 1;  
    //this.loginDetails.UserName = null;  
    this.athenticationService.updatePassword(this.loginDetails).subscribe(response=>{
        if(response != -1)
        {
          this.athenticationService.openSnackBar("Your Password updated successfully", 3000);
          this.athenticationService.setAuthProperties(null);
          this.route.navigate(['login']);
        }
        else
        {
          this.loginDetails.Password = null;
          this.resetPasswordForm.markAllAsTouched();
        }
    });
  } 
}
