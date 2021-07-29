import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginDetails } from '../../../model/login-details';
import { AdminService } from '../../../service/admin.service';
import { AthenticationService } from '../../../service/athentication.service';
import { MustMatch } from '../../../service/confirm-validator';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit { 
  signUpForm: FormGroup
  submitted= false;
  isInvalidInput: boolean = false
  hide = true;
  resetPassword: string = '';
  
  constructor(public loginDetails: LoginDetails,
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: Router) { }

  ngOnInit() {

    this.loginDetails = new LoginDetails();
    this.signUpForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      UserName: ['', Validators.required],
      PhoneNumber: ['', Validators.required],
      Email:  ['', [Validators.required, Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        Password: ['', [Validators.required]],
          //Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}$')]],
        ConfirmPassword:  ['', [Validators.required]],
          //Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}$')]], 
        validators: MustMatch('Password','ConfirmPassword') 
    });
  } 

  get f(){
    return this.signUpForm.controls;
  }

  signUp()
  {
    this.submitted = true;
    if(this.signUpForm.invalid){
      this.submitted = false;
      return;
    } 

    this.loginDetails.FirstName = this.signUpForm.controls.FirstName.value;
    this.loginDetails.LastName = this.signUpForm.controls.LastName.value;
    this.loginDetails.UserName = this.signUpForm.controls.UserName.value;
    this.loginDetails.Email = this.signUpForm.controls.Email.value;
    this.loginDetails.Password = this.signUpForm.controls.Password.value;
    this.loginDetails.PhoneNumber = this.signUpForm.controls.PhoneNumber.value;    

    this.adminService.isUserNameExist(this.loginDetails).subscribe(response=>{
      if(response)
      { 
        this.isInvalidInput = true;
        this.submitted = false;
        this.signUpForm.markAllAsTouched();
      }
      else
      {
        this.isInvalidInput = false; 
        this.route.navigate(['verification-code', 'signUp']);
      }
    });
  }  
}
