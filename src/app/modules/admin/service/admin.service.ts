import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PatiantInformation } from '../model/PatiantInformation';
import { DynamicServiceUrls } from 'src/app/shared/model/dynamic-service-urls';
import { LoginDetails } from '../model/login-details';
import { ReportRequest } from '../model/login-details'
import { MatSnackBar } from '@angular/material/snack-bar';
import { isNullOrUndefined } from 'util';
import { EmailProperties } from '../model/email-properties';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
 
  adminService = this.dynamicServiceUrls.adminService;
  headers = new HttpHeaders().set('Content-Type','application/json')

  webApiUrl = '';
  postData = ''; 
  objLoginDetails: any;

  constructor(private http : HttpClient,
    private dynamicServiceUrls: DynamicServiceUrls,
    private _snackBar: MatSnackBar) {
    this.patientStatusInit();
     }
     
  public patientStatuses: any[]=[];

  public patientStatusInit(){
    this.getPatientStatus().subscribe(response=>{
      this.patientStatuses = response;            
  })
    //this.getPatientStatus().subscribe(s=>{ this.patientStatuses=s;});
    //console.log(this.patientStatuses);
  }

  // getPatientsList(startDate, endDate): Observable<any>{
  //   this.webApiUrl = `${this.adminService}GetPatientsList`;

  //   this.postData = JSON.stringify({ startDate: startDate, endDate : endDate });

  //   return this.http.post(this.webApiUrl, this.postData, { headers: this.headers}).pipe(
  //     catchError(this.errorHandler)
  //   )
  // }

  getPatientsList(reportRequest: ReportRequest): Observable<any>{
    this.webApiUrl = `${this.adminService}GetPatientsList`;

    //this.postData = JSON.stringify({ startDate: startDate, endDate : endDate });

    this.postData = JSON.stringify(reportRequest);

    return this.http.post(this.webApiUrl, this.postData, { headers: this.headers}).pipe(
      catchError(this.errorHandler)
    )
  }

  updatePatiantDetails(patiantDetails: any): Observable<any>{
    this.webApiUrl = `${this.adminService}UpdatePatiantDetails`;
    this.postData = JSON.stringify(patiantDetails);

    return this.http.post(this.webApiUrl, this.postData, { headers: this.headers}).pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      //localStorage.setItem('currentUser', JSON.stringify(user));
      //this.currentUserSubject.next(user);
      return user;
    }));
  }

  getAnswers(patiantDetails: PatiantInformation): Observable<any>{
    this.webApiUrl = `${this.adminService}GetAnswers`;
    this.postData = JSON.stringify(patiantDetails);
    return this.http.post(this.webApiUrl, this.postData, { headers: this.headers}).pipe(map(answers => {
      return answers;
  }));
  }
  
  addUserLoginDetails(loginDetails: LoginDetails) {
    this.postData = JSON.stringify(loginDetails);
    return this.http.post<any>(`${ this.adminService }AddUserLoginDetails`,this.postData,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }  

  isUserNameExist(loginDetails: LoginDetails) {
    this.objLoginDetails = loginDetails;
    this.postData = JSON.stringify(loginDetails);
    return this.http.post<any>(`${ this.adminService }IsUserNameExist`,this.postData,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }
  
  returLoginDetails(){
    if(isNullOrUndefined(this.objLoginDetails)){
      this.objLoginDetails = new LoginDetails();
    }
    return this.objLoginDetails;
  }

  setLoginDetails(loginDetails: LoginDetails) {
   this.objLoginDetails = this.objLoginDetails;
  }

  getUserDetails(sortingColunm : string) { 
    return this.http.get<any>(`${ this.adminService }GetUserDetails?sortingColumn=` + sortingColunm,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  } 

  updateUserDetails(loginDetails: LoginDetails) {
    this.postData = JSON.stringify(loginDetails);
    return this.http.post<any>(`${ this.adminService }UpdateUserDetails`,this.postData,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  } 

  getPharmacyReportSpecific(submissionId: any){
    this.postData = JSON.stringify(submissionId);
    return this.http.post<any>(`${ this.adminService }PharmacyReportSpecific`, this.postData,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  GetActivityLogs(reportRequest: ReportRequest) {
    this.postData = JSON.stringify(reportRequest);
    return this.http.post<any>(`${ this.adminService }GetActivityLogs`, this.postData,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  } 

  getPharmacyDetails(): Observable<any>{
    this.webApiUrl = `${this.adminService}GetPharmacyDetailsList`; 
    return this.http.post(this.webApiUrl,{ headers: this.headers}).pipe(
      catchError(this.errorHandler)
    )
  }

  

  getPatientStatus(): Observable<any>{
    this.webApiUrl = `${this.adminService}GetStatusDetails`; 
    return this.http.post(this.webApiUrl,{ headers: this.headers}).pipe(
      catchError(this.errorHandler)
    )
  }

  
  getPriscriptionDetails(submissionId:number): Observable<any>{
    this.webApiUrl = `${this.adminService}GetPriscriptionDetails?submissionId=` + submissionId;
    return this.http.post(this.webApiUrl,{ headers: this.headers}).pipe(
      catchError(this.errorHandler)
    )
  }  

  getMedicineDetails(sequenceId:number): Observable<any>{
    this.webApiUrl = `${this.adminService}GetMedicines?sequenceId=` + sequenceId;
    return this.http.post(this.webApiUrl,{ headers: this.headers}).pipe(
      catchError(this.errorHandler)
    )
  }

  
  updatePharmacyDetails(pharmcyDetails: any, submissionId: number, prescriptionNote: string) {
    this.postData = JSON.stringify(pharmcyDetails);
    return this.http.post<any>(`${ this.adminService }UpdatePharmacyInSubmissionDetails?submissionId=`+ submissionId + '&prescriptionNote=' + prescriptionNote,
    this.postData,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  } 

  insertMedicineDetails(medicineDetails: any, userId: number, prescriptionNote: string) {
    this.postData = JSON.stringify(medicineDetails);
    return this.http.post<any>(`${ this.adminService }InsertMedicineDetails?userId=`+ userId + '&prescriptionNote=' + prescriptionNote,
    this.postData,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  } 
  getEscribeDetails(submissionId: number): Observable<any>{
    this.webApiUrl = `${this.adminService}GetEscibeDetails?submissionId=` + submissionId; 

    return this.http.post(this.webApiUrl,{ headers: this.headers}).pipe(
      catchError(this.errorHandler)
    )
  }

  getPrescriptionDetails(submissionId: number): Observable<any>{
    this.webApiUrl = `${this.adminService}GetPrescriptionDetails?submissionId=` + submissionId; 

    return this.http.post(this.webApiUrl,{ headers: this.headers}).pipe(
      catchError(this.errorHandler)
    )
  }
  getRefills(reportRequest: ReportRequest): Observable<any>{
      this.webApiUrl = `${this.adminService}GetRefills`;
  
      //this.postData = JSON.stringify({ startDate: startDate, endDate : endDate });
  
      this.postData = JSON.stringify(reportRequest);
  
      return this.http.post(this.webApiUrl, this.postData, { headers: this.headers}).pipe(
        catchError(this.errorHandler)
      )
    }
   
  getReferrals(reportRequest: ReportRequest): Observable<any>{
    this.webApiUrl = `${this.adminService}getReferrals`;
    this.postData = JSON.stringify(reportRequest);
    return this.http.post(this.webApiUrl, this.postData, { headers: this.headers}).pipe(
      catchError(this.errorHandler)
    )
  }  
  
  //For format yyyy-MM-dd
  returnFormatedDate(inputDate: any) : any {
   let month = inputDate.getMonth() + 1;
   return inputDate.getFullYear() + '-' + 
    ("0" + month).slice(-2) + '-' + 
    ("0" + inputDate.getDate()).slice(-2);
  }

  //For format MM/dd/yyyy
  returnFormatedDate2(inputDate: any) : any {
    let month = inputDate.getMonth() + 1;
    return ("0" + month).slice(-2) + '/' + ("0" + inputDate.getDate()).slice(-2) + '/' + inputDate.getFullYear();
   }

  errorHandler(error: HttpErrorResponse){
    let errorMessage = `Error code ${error.status}\nMessage: ${error.message}`;
    return throwError(errorMessage);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  sendmailToAllPatient(emailprop: EmailProperties){
    this.postData = JSON.stringify(emailprop);
    return this.http.post<any>(`${ this.adminService }SendMailToPatient`, this.postData,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  getPharmacyReport(searchModel: any){
    this.postData = JSON.stringify(searchModel);
    return this.http.post<any>(`${ this.adminService }PharmacyReport`, this.postData,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  getMedicine(){
    return this.http.get<any>(`${ this.adminService }GetMedicineDetails`,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  getMedicineById(id){
    return this.http.get<any>(`${ this.adminService }GetMedicineById?id=` + id,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  getMedicineCategories(){
    return this.http.get<any>(`${ this.adminService }GetMedicineCategory`,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  insertnedicine(medicineDetail: any){
    this.postData = JSON.stringify(medicineDetail);
    console.log(this.postData);
    return this.http.post<any>(`${ this.adminService }AddMedicineDetails`, this.postData,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  UpdateMedicineDetails(medicineDetail: any){
    this.postData = JSON.stringify(medicineDetail);
    console.log(this.postData);
    return this.http.post<any>(`${ this.adminService }UpdateMedicineDetails`, this.postData,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }
  DeleteMedicineDetails(id: any){
    return this.http.get<any>(`${ this.adminService }DeleteMedicineDetails?id=` + id,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  GetMedicineDeliveryReport(deliveryModel: any){
    this.postData = JSON.stringify(deliveryModel);
    console.log(this.postData);
    return this.http.post<any>(`${ this.adminService }GetMedicineDeliveryReport`, this.postData,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  updatePharmacyForMedicineDelivery (pharmacyUpdatemodel) {
    this.postData = JSON.stringify(pharmacyUpdatemodel);
    console.log(this.postData);
    return this.http.post<any>(`${ this.adminService }UpdatePharmacyForMedicineDelivery`, this.postData,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  updateDeliveryNote(pharmacyModel) {
    this.postData = JSON.stringify(pharmacyModel);
    //console.log("Withing the Delivery Note : " + this.postData);
    return this.http.post<any>(`${ this.adminService }updateDeliveryNote`, this.postData,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  getPharmacyUserLoginDetails(){
    return this.http.get<any>(`${ this.adminService }GetPharmacyUserLoginDetails`,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  GetPharmacyUserLoginDetailsById(id){
    return this.http.get<any>(`${ this.adminService }GetPharmacyUserLoginDetailsById?id=` + id,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  insertUpdatePharmacyLoginDetails (pharmacy) {
    this.postData = JSON.stringify(pharmacy);
    console.log(this.postData);
    return this.http.post<any>(`${ this.adminService }InsertUpdatePharmacyLoginDetails`, this.postData,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  deletePharmacyLoginDetails(id: any){
    return this.http.get<any>(`${ this.adminService }DeletePharmacyLoginDetails?id=` + id,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  getPromocodeDetails(){
    return this.http.get<any>(`${ this.adminService }GetPromocodeDetails`,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  GetPromocodeDetailsById(id){
    return this.http.get<any>(`${ this.adminService }GetPromocodeDetailsById?id=` + id,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  insertUpdatePromocodeDetails (promo) {
    this.postData = JSON.stringify(promo);
    console.log('IN ADMIN SERVICE : ' + this.postData);
    return this.http.post<any>(`${ this.adminService }InsertUpdatePromocodeDetails`, this.postData,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  deletePromocodeDetails(id: any){
    return this.http.get<any>(`${ this.adminService }DeletePromocodeDetails?id=` + id,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  getUserTypes() {
    return this.http.get<any>(`${ this.adminService }GetUserTypes`,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  getMenues() {
    return this.http.get<any>(`${ this.adminService }GetMenues`,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  getSelectedMenuesByUserType(id: any){
    return this.http.get<any>(`${ this.adminService }GetSelectedMenuesByUserType?id=` + id,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }

  mapMenuAccessToUser (requestModel) {
    this.postData = JSON.stringify(requestModel);
    return this.http.post<any>(`${ this.adminService }MapMenuAccessToUser`, this.postData,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }
  updatePharmaPayDetails (requestModel) {
    this.postData = JSON.stringify(requestModel);
    return this.http.post<any>(`${ this.adminService }UpdatePharmaPayDetails`, this.postData,
    { headers: this.headers}).pipe(catchError(this.errorHandler));
  }
}
