import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DynamicServiceUrls } from 'src/app/shared/model/dynamic-service-urls';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {
  adminService = this.dynamicServiceUrls.adminService;
  headers = new HttpHeaders().set('Content-Type','application/json')
  webApiUrl = '';
  postData = ''; 

  constructor(private http : HttpClient,
    private dynamicServiceUrls: DynamicServiceUrls,) { }

  getPharmacyDetails(model): Observable<any>{
    this.postData = JSON.stringify(model);
    this.webApiUrl = `${this.adminService}GetPharmacyDetailsList`; 

    return this.http.post(this.webApiUrl,this.postData,{ headers: this.headers}).pipe(
      catchError(this.errorHandler)
    )
  }

  updateUserDetails(pharmcyDetails: any) {
    this.postData = JSON.stringify(pharmcyDetails);
    return this.http.post<any>(`${ this.adminService }UpdatePharmacyInSubmissionDetails`,this.postData,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  } 

  errorHandler(error: HttpErrorResponse){
    let errorMessage = `Error code ${error.status}\nMessage: ${error.message}`;
    return throwError(errorMessage);
  }
}
