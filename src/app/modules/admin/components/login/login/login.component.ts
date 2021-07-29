import { Component, OnInit } from '@angular/core';
import { AthenticationService } from '../../../service/athentication.service';
import { LoginDetails } from '../../../model/login-details';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit { 
  loginForm: FormGroup
  isInvalidInput: boolean = false
  loading = false;
  
  constructor(private authenticationService: AthenticationService,
    private fb: FormBuilder,
    public loginDetails: LoginDetails,
    private route: Router) { 
      if (this.authenticationService.currentUserValue) { 
        this.route.navigate(['user/submissions-list']);
      }
      this.loginDetails = new LoginDetails();
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      UserName: ['', Validators.required],
      Password:  ['', Validators.required]
    });
  }

  login()
  {
    if(this.loginForm.invalid) return; 
    this.loginDetails.UserName = this.loginForm.controls.UserName.value;
    this.loginDetails.Password = this.loginForm.controls.Password.value;
    this.loginDetails.Email = null; 

    this.loading = true;

    this.isInvalidInput = false;
    //this.route.navigate(['user/submissions-list']);

    this.authenticationService.login(this.loginDetails).pipe(first())
        .subscribe(
            data => {
              if(isNullOrUndefined(data))
              {
                this.loading = false;
                this.isInvalidInput = true;
              }
              else
              {
                this.isInvalidInput = false;
                this.route.navigate(['user/submissions-list']);
              } 
            },
            error => {
                //console.log(error);
                this.loading = false;
                this.isInvalidInput = true;
        });
    }  

  get f() {
    return this.loginForm.controls;
  }
}
