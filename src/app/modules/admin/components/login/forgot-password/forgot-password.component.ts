import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AthenticationService } from '../../../service/athentication.service';
import { AuthProperties, LoginDetails } from '../../../model/login-details';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup
  submitted= false;
  isInvalidInput: boolean = false
  userId : any;
  
  constructor(private athenticationService: AthenticationService,
    private fb: FormBuilder,
    public loginDetails: LoginDetails,
    private router: Router)
    {
      this.loginDetails = new LoginDetails();
      localStorage.IsVerified = null;
    }

  ngOnInit() {
    this.forgetPasswordForm = this.fb.group({
      UserName: ['', Validators.required],
      Email:  ['', [Validators.required, Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
    });
  }

  get f(){
    return this.forgetPasswordForm.controls;
  }

  login()
  {
    this.submitted = true;
    if(this.forgetPasswordForm.invalid){
      this.submitted = false;
      return;
    } 

    this.loginDetails.UserName = this.forgetPasswordForm.controls.UserName.value;
    this.loginDetails.Email = this.forgetPasswordForm.controls.Email.value;

    let objAuthProperties = new AuthProperties();
    let copyLoginDetails =  Object.assign({}, this.loginDetails);
    objAuthProperties.IsVerifiedUser = false;
    objAuthProperties.loginDetails = copyLoginDetails;

    this.athenticationService.sendForgetPwdVerificationCode(objAuthProperties).subscribe(response=>{
      if(response.isVerifiedUser)
      {
        this.athenticationService.setAuthProperties(response)
        localStorage.IsVerified = true;
        this.isInvalidInput = false;
        this.router.navigate(['/verification-code', 'forgetPwt']);

        //console.log(response)
      }
      else
      {
        //this.loginDetails.UserName = null;
        //this.loginDetails.Email = null;
        this.isInvalidInput = true;
        this.submitted = false;
        this.forgetPasswordForm.markAllAsTouched();
      }
    });
  } 
}
