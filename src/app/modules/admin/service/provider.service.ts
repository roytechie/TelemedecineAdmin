import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DynamicServiceUrls } from 'src/app/shared/model/dynamic-service-urls';
import { ProviderInformation } from '../model/provider-information';
import { FileToUpload, UserDetails } from '../model/user-details';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  providerService = this.dynamicServiceUrls.providerService;
  headers = new HttpHeaders().set('Content-Type','application/json')

  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
  }

  ProviderInfoServiceDetails: any;

  webApiUrl = '';
  postData = ''; 

  constructor(private http : HttpClient,
    private dynamicServiceUrls: DynamicServiceUrls) { } 

    getProviderInformation(userDetails: UserDetails): Observable<any>{
      this.webApiUrl = `${this.providerService}GetProviderInformation`; 
      this.postData = JSON.stringify(userDetails); 

      return this.http.post(this.webApiUrl, this.postData, { headers: this.headers}).pipe(
          catchError(this.errorHandler))
    }

    getDEARegistration(userDetails: UserDetails): Observable<any> {
      this.webApiUrl = `${this.providerService}GetDEARegistration`; 
      this.postData = JSON.stringify(userDetails);   
      return this.http.post(this.webApiUrl, this.postData, { headers: this.headers}).pipe(
          catchError(this.errorHandler))
    }

    getLicenseRegistration(userDetails: UserDetails): Observable<any> {
      this.webApiUrl = `${this.providerService}GetLicenseRegistration`; 
      this.postData = JSON.stringify(userDetails); 
  
      return this.http.post(this.webApiUrl, this.postData, { headers: this.headers}).pipe(
          catchError(this.errorHandler))
    } 

    GetProfessionalReferences(userDetails: UserDetails): Observable<any> {
      this.webApiUrl = `${this.providerService}GetProfessionalReferences`; 
      this.postData = JSON.stringify(userDetails); 
  
      return this.http.post(this.webApiUrl, this.postData, { headers: this.headers}).pipe(
          catchError(this.errorHandler))
    }
    
    updateProviderInformation(providerInformation: ProviderInformation): Observable<any> {
      this.webApiUrl = `${this.providerService}UpdateProviderInformation`; 
      this.postData = JSON.stringify(providerInformation); 
      return this.http.post(this.webApiUrl, this.postData, { headers: this.headers}).pipe(
          catchError(this.errorHandler))
    } 

    updateDEARegistration(listDEARegistration: any): Observable<any> {
      this.webApiUrl = `${this.providerService}UpdateDEARegistration`; 
      this.postData = JSON.stringify(listDEARegistration); 
  
      return this.http.post(this.webApiUrl, this.postData, { headers: this.headers}).pipe(
          catchError(this.errorHandler))
    } 

    updateLicenseRegistration(listLicenseRegistration: any): Observable<any> {
      this.webApiUrl = `${this.providerService}UpdateLicenseRegistration`; 
      this.postData = JSON.stringify(listLicenseRegistration); 
  
      return this.http.post(this.webApiUrl, this.postData, { headers: this.headers}).pipe(
          catchError(this.errorHandler))
    } 

    UpdateProfessionalReferences(listProfessionalReferences: any): Observable<any> {
      this.webApiUrl = `${this.providerService}UpdateProfessionalReferences`; 
      this.postData = JSON.stringify(listProfessionalReferences); 
  
      return this.http.post(this.webApiUrl, this.postData, { headers: this.headers}).pipe(
          catchError(this.errorHandler))
    }  

    setProviderInfoServiceDetails(providerInformation : ProviderInformation ){
        this.ProviderInfoServiceDetails = providerInformation; 
    }

    getProviderInfoServiceDetails(): Observable<any> {
        return this.ProviderInfoServiceDetails;
    }

    errorHandler(error: HttpErrorResponse){
      let errorMessage = `Error code ${error.status}\nMessage: ${error.message}`;
      return throwError(errorMessage);
    }

    uploadFile(theFile: FileToUpload) : Observable<any> {
      return this.http.post<FileToUpload>(`${ this.providerService }UploadDocument`, theFile, this.httpOptions);
    } 

    AddFileDetails(data: FormData): Observable<string>{  
      // let headers = new HttpHeaders();  
      // headers.append('Content-Type', 'application/json');  
      // const httpOptions = {  
      //     headers: headers  
      // };  
      return this.http.post<string>(`${ this.providerService }upload`, data);  
  } 

  uploadImages(data: any) : Observable<any> {
    let userId = localStorage['userId'];
    return this.http.post<FileToUpload>(`${ this.providerService }UploadImage?userId=` +userId , data, this.httpOptions);
  } 

  getEscriptXMLData(escribe: any) {
      let patiantInfo = escribe.patiantInformation,
      providerInformation = escribe.providerInformation,
      pharmacyDetails = escribe.pharmacyDetails;

      let firstName = 'Dr Stella', lastName = 'Immanuel',
      clinicName = 'Frontline MDs - Dr Stella Immanuel',
      fromAddress = '3603 South Street, Brookshire, TX 77423',
      //phoneNo = '+1 832 808 5574',
      prefix = JSON.parse(patiantInfo.profileDetails)[3].Answer == 'Male' ? 'MR' : 'MRS';
      patiantInfo.pharmacyName = patiantInfo.pharmacyName.replace('&','&amp;')

      return `<Message>
      <Header>
          <To>` + patiantInfo.pharmacyName.trim() + `</To>
          <From>`+ clinicName +`</From>
          <MessageID>`+ escribe.messageID +`</MessageID>  
          <SentTime>`+ new Date().toISOString() +`</SentTime>
          <SenderSoftware>
              <SenderSoftwareDeveloper>` + fromAddress + `</SenderSoftwareDeveloper>
              <SenderSoftwareProduct>null</SenderSoftwareProduct>
              <SenderSoftwareVersionRelease>null</SenderSoftwareVersionRelease>
          </SenderSoftware>
          <PrescriberOrderNumber>`+ escribe.prescriberOrderNumber +`</PrescriberOrderNumber>
      </Header>
      <Body>
          <NewRx>
              <Pharmacy>
                  <Identification>
                      <NCPDPID>` + patiantInfo.pharmacyName.trim() + `</NCPDPID>
                  </Identification>
                  <StoreName>` + patiantInfo.pharmacyName.trim() + `</StoreName>
                  <Address>
                      <AddressLine1>` + pharmacyDetails.pharmacyAddress + `</AddressLine1>
                      <City>` + pharmacyDetails.pharmacyCity + `</City>
                      <State>` + pharmacyDetails.pharmacyState + `</State>
                      <ZipCode>` + pharmacyDetails.pharmacyZipCode + `</ZipCode>
                  </Address>
                  <CommunicationNumbers>
                      <Communication>
                          <Number>` + pharmacyDetails.pharmacyContactNum + `</Number>
                          <Qualifier>null</Qualifier>
                      </Communication>
                  </CommunicationNumbers>
              </Pharmacy>
              <Prescriber>
                  <Identification>
                      <NPI>`+ providerInformation.npi +`</NPI>
                      <StateLicenseNumber>null</StateLicenseNumber>
                  </Identification>
                  <ClinicName>`+ clinicName +`</ClinicName>
                  <Name>
                      <LastName>`+ providerInformation.lastName +`</LastName>
                      <FirstName>`+ providerInformation.firstName +`</FirstName>
                      <MiddleName>null</MiddleName>
                  </Name>
                  <Address>
                      <AddressLine1>`+ providerInformation.practiceAddress +`</AddressLine1>
                      <City>`+ providerInformation.city +`</City>
                      <State>`+ providerInformation.state +`</State>
                      <ZipCode>`+ providerInformation.zipCode +`</ZipCode>
                  </Address>
                  <PrescriberAgent>
                      <LastName>` + lastName + `</LastName>
                      <FirstName>` + firstName + `</FirstName>
                  </PrescriberAgent>
                  <CommunicationNumbers>
                      <Communication>
                          <Number>`+ providerInformation.phoneNumber +`</Number>
                          <Qualifier>null</Qualifier>
                      </Communication>
                  </CommunicationNumbers>
              </Prescriber>
              <Patient>
                  <Identification>
                      <PayerID>` + patiantInfo.submissionId + `</PayerID>
                      <PayerID>null</PayerID>
                  </Identification>
                  <Name>
                      <LastName>` + JSON.parse(patiantInfo.profileDetails)[2].Answer + `</LastName>
                      <FirstName>` + JSON.parse(patiantInfo.profileDetails)[0].Answer + `</FirstName>
                      <Prefix>` + prefix + `</Prefix>
                  </Name>
                  <Gender>` + JSON.parse(patiantInfo.profileDetails)[3].Answer + `</Gender>
                  <DateOfBirth>
                      <Date>` + JSON.parse(patiantInfo.profileDetails)[8].Answer + `</Date>
                  </DateOfBirth>
                  <Address>
                      <AddressLine1>` + JSON.parse(patiantInfo.profileDetails)[4].Answer + `</AddressLine1>
                      <City>` + JSON.parse(patiantInfo.profileDetails)[5].Answer + `</City>
                      <State>` + JSON.parse(patiantInfo.profileDetails)[6].Answer + `</State>
                      <ZipCode>` + JSON.parse(patiantInfo.profileDetails)[7].Answer + `</ZipCode>
                  </Address>
                  <CommunicationNumbers>
                      <Communication>
                          <Number>` + JSON.parse(patiantInfo.profileDetails)[9].Answer + `</Number>
                          <Qualifier>null</Qualifier>
                      </Communication>
                  </CommunicationNumbers>
              </Patient>
              <MedicationPrescribed>
                  <DrugDescription>null</DrugDescription>
                  <DrugCoded>
                      <ProductCode>null</ProductCode>
                      <ProductCodeQualifier>null</ProductCodeQualifier>
                  </DrugCoded>
                  <Quantity>
                      <Value>null</Value>
                      <CodeListQualifier>null</CodeListQualifier>
                      <UnitSourceCode>null</UnitSourceCode>
                      <PotencyUnitCode>null</PotencyUnitCode>
                  </Quantity>
                  <Directions>null</Directions>
                  <Note>null</Note>
                  <Refills>
                      <Qualifier>null</Qualifier>
                      <Value>null</Value>
                  </Refills>
                  <Substitutions>null</Substitutions>
                  <WrittenDate>
                      <Date>null</Date>
                  </WrittenDate>
              </MedicationPrescribed>
              <BenefitsCoordination>
                  <PayerIdentification>
                      <BINLocationNumber>null</BINLocationNumber>
                      <MutuallyDefined>null</MutuallyDefined>
                      <PayerID>null</PayerID>
                  </PayerIdentification>
                  <PayerName>null</PayerName>
                  <CardholderID>null</CardholderID>
                  <GroupID>null</GroupID>
              </BenefitsCoordination>
              <BenefitsCoordination>
                  <PayerIdentification>
                      <BINLocationNumber>null</BINLocationNumber>
                      <PayerID>null</PayerID>
                  </PayerIdentification>
                  <CardholderID>null</CardholderID>
                  <GroupID>null</GroupID>
              </BenefitsCoordination>
          </NewRx>
      </Body>
  </Message>`
  } 
} 