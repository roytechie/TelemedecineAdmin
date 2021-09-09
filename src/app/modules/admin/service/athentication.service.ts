import { Injectable } from '@angular/core';
import { AccessLavel, AuthProperties, LoginDetails } from '../model/login-details';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { DynamicServiceUrls } from 'src/app/shared/model/dynamic-service-urls';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<LoginDetails>;

  userLoginService = this.dynamicServiceUrls.userLoginService;
  adminService = this.dynamicServiceUrls.adminService
  
  headers = new HttpHeaders().set('Content-Type','application/json');
  webApiUrl = '';
  postData = '';
  authProperties : AuthProperties

  constructor(private http : HttpClient,
    private dynamicServiceUrls: DynamicServiceUrls,
    private _snackBar: MatSnackBar, private router: Router) {
      this.currentUserSubject = new BehaviorSubject<LoginDetails>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
  } 
    
  public get currentUserValue(): any {
      return this.currentUserSubject.value;
  }

  public checkAccessLavel(user: any): AccessLavel {
    if(user.accessLevel == AccessLavel.Admin){
      return AccessLavel.Admin
    }
    else if(user.accessLevel == AccessLavel.Pharmacy){
      return AccessLavel.Pharmacy
    }
    else if(user.accessLevel == AccessLavel.Doctor){
      return AccessLavel.Doctor
    }
    else {
      return AccessLavel.Other
    }
  }

  public isMenuAccessbableToUser (menuCode) {
    
  }

  public defaultRerirectionAfterLogin(accessValue: AccessLavel) {
    console.log(accessValue);
    if(accessValue == AccessLavel.Admin) {
      this.router.navigate(['/user/submissions-list']);
    }
    else if(accessValue == AccessLavel.Pharmacy) {
      this.router.navigate(['/user/pharmacy-report']);
    }
  }

  login(loginDetails: LoginDetails) {

    // this.IsValidUser(loginDetails).subscribe(res => {
    //   return res;  
    // }); 

    let username =  loginDetails.UserName, password = loginDetails.Password;
    return this.http.post<any>(`${this.userLoginService}authenticateAsync`, { username, password })
        .pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
        }),catchError(this.handleError));

  }

  isValidUser(loginDetails: LoginDetails): Observable<any>
  {
    this.webApiUrl = `${this.adminService}IsValidUser`;
    this.postData = JSON.stringify(loginDetails);

    return this.http.post(this.webApiUrl, this.postData, { headers: this.headers});
  }

  sendForgetPwdVerificationCode(authProperties: AuthProperties): Observable<any>
  {
    this.webApiUrl = `${ this.userLoginService }sendForgetPwdVerificationCode`;
    this.postData = JSON.stringify(authProperties);

    return this.http.post(this.webApiUrl, this.postData, { headers: this.headers});
  }

  // logOut(loginDetails: LoginDetails): Observable<any>{
  //   // remove user from local storage to log user out
  //   this.webApiUrl = `${this.adminService}LogOut`;
  //   this.postData = JSON.stringify(loginDetails);

  //   return this.http.post(this.webApiUrl, this.postData, { headers: this.headers}).pipe(map(user => { 
  //     localStorage.removeItem('currentUser');
  //     this.currentUserSubject.next(null);
  //     return user;
  //   })); 
  // }

  logOut()
  {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  verifyAccount(loginDetails: any): Observable<any>{
    this.webApiUrl = `${this.userLoginService}checkVerificationCode?` +
    `verificationCode=` + loginDetails.verificationCode;
    this.postData = JSON.stringify(loginDetails.loginDetails);

    return this.http.post(this.webApiUrl, this.postData, { headers: this.headers}).pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      //this.currentUserSubject.next(user);
      return user;
  }));
  }

  updatePassword(loginDetails: LoginDetails): Observable<any>{
    this.webApiUrl = `${this.adminService}UpdateLoginPassword`;
    this.postData = JSON.stringify(loginDetails);

    return this.http.post(this.webApiUrl, this.postData, { headers: this.headers}).pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));
      //this.currentUserSubject.next(user);
      return user;
  }));
  }

  sendVerificationCode(loginDetails: LoginDetails): Observable<any> {
    this.webApiUrl = `${this.userLoginService}sendVerificationCode`;
    this.postData = JSON.stringify(loginDetails);

    return this.http.post(this.webApiUrl, this.postData, { headers: this.headers}).pipe();
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
        // client-side error
        errorMessage = `Error: ${error.error.message}`;
    } else {
        // server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //console.log(errorMessage);
    return throwError(errorMessage);
  }

  openSnackBar(message: string, time: number) {
    this._snackBar.open(message, '', {
      duration: time,
    });
  } 

  setAuthProperties(authProperties: AuthProperties){
    //this.authProperties = new AuthProperties();
    this.authProperties = authProperties;
  }   

  getAuthProperties() 
  {
    return this.authProperties;
  }  
}
