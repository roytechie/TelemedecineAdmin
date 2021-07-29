import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { DEARegistration } from '../../../model/dearegistration';
import { CountryList, ProviderInformation } from '../../../model/provider-information';
import { FileToUpload, UserDetails } from '../../../model/user-details';
import { ProviderService } from '../../../service/provider.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; 
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { DEARegistrationComponent } from '../dearegistration/dearegistration.component';
import { LicenseRegistrationsComponent } from '../license-registrations/license-registrations.component';
import { ProfessionalReferencesComponent } from '../professional-references/professional-references.component';
import { SignaturePadComponent } from '../signature-pad/signature-pad.component'; 
import SignaturePad from 'signature_pad';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicServiceUrls } from 'src/app/shared/model/dynamic-service-urls'; 
import { AthenticationService } from '../../../service/athentication.service';

@Component({
  selector: 'app-authorization-form',
  templateUrl: './authorization-form.component.html',
  styleUrls: ['./authorization-form.component.scss']
})
export class AuthorizationFormComponent implements OnInit, AfterViewInit  {

  @ViewChild(DEARegistrationComponent) childDEARegistration: DEARegistrationComponent;
  @ViewChild(LicenseRegistrationsComponent) childLicenseRegistrations: LicenseRegistrationsComponent;
  @ViewChild(ProfessionalReferencesComponent) childProfessionalReferences: ProfessionalReferencesComponent;
  @ViewChild(SignaturePadComponent) childSignaturePadComponent: SignaturePadComponent;  

  profession : any = [];
  ContactPersionList : any = this.objProviderInfo.ContactPersionList;
  deaRegistraionStatus : any;
  startDate : Date = new Date
  providerInfo : any = [];
  countryFormControl = new FormControl();
  country : any;
  practiceCountry: any;
  @ViewChild('sPad', {static: true}) signaturePadElement;
  signaturePad: any;

  theFile: any = null;
  messages: string[] = [];
  MAX_SIZE: number = 1048576; 
  theFiles: any[] = [];
  showSignaturePad: boolean = true; 
  signatureUrl: string = ''
  defaultSelectOption: any = undefined
  basicForm: FormGroup;
  public progress: number;
  public message: string;
  loading: boolean = false;

  constructor(private providerService: ProviderService,
    private userDetails: UserDetails,
    public dynamicServiceUrls : DynamicServiceUrls,
    public objProviderInfo: ProviderInformation, 
    private http: HttpClient,
    public dEARegistration : DEARegistration,
    private fb: FormBuilder,
    private athenticationService: AthenticationService,
    private router: Router,
    public countryList: CountryList,
    private route: ActivatedRoute) {
      if(isNullOrUndefined(this.athenticationService.currentUserValue)) { 
        this.router.navigate(['/login']);
      } 
      this.deaRegistraionStatus = this.dEARegistration.registrationStatus; 

      this.country = {
        alpha2Code: "US",
        alpha3Code: "USA",
        name: "Vereinigte Staaten von Amerika",
        numericCode: "840"
      }; 

      this.practiceCountry = {
        alpha2Code: "US",
        alpha3Code: "USA",
        name: "Vereinigte Staaten von Amerika",
        numericCode: "840"
      };

      const id: string = route.snapshot.params.id;
      if(id==undefined || id==null)
      {
        localStorage['userId'] = this.athenticationService.currentUserValue.id;
      }
      else
      {
        localStorage['userId'] = id;
      } 
       //console.log(localStorage['userId'])
     }



  ngOnInit() {  
    this.providerInfo = new ProviderInformation
    this.basicForm = this.fb.group({
      firstName: ['', Validators.required],
      initial: [''],
      lastName: ['', Validators.required],
      mailingAddress: ['', Validators.required],
      city: [''],
      state: [''],
      zipCode: [''],
      country: [''],
      phoneNumber: ['',Validators.pattern("^[0-9]*$")],
      mobileNumber: ['', [Validators.required,Validators.pattern("^[0-9]*$")]],
      email:  ['', [Validators.required, Validators.email,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],        
      practiceAddress: [''], 
      practiceCity: [''], 
      practiceState: [''], 
      practiceZipCode: [''], 
      practiceCountry: [''], 
      faxNumber: [''],  
    
      socialSecurity: ['', Validators.required], 
      speciality: ['', Validators.required], 
      npi: ['', Validators.required],  
      medicareValidation: [''], 
      education: [''],  

      nursingSchool: [''], 
      nursingYearOfGraduation: [''], 
      pgEducation: [''], 
      pgYearOfGraduation: [''], 
      isBoardEligible: ['', Validators.required],  
      
      isBoardCertified: ['', Validators.required],  
      boardName: [''], 
      certifiedNumber: [''], 
      gender: [''], 
      dob: ['', Validators.required],  

      contactPerson: [''],  
      isOwnPractice: [''],  
      languageKnown: [''], 
       
      //isFullTimeJob: [''], 
      //hours: [''], 
      //scheduledDays: [''], 
      //preferedTypeOfConsults: [''], 
      //scheduleComment: [''],   
      
      //cvFileName: [''], 
      //otherFileName: [''], 
      submittedDate: ['', Validators.required],
      //signatureName: [''], 
      isDiciplinaryByOthers: [''],// Validators.required],
      isStateProfessionalLicense: [''],
      isHospitalPrivilegesDenied: [''],
      isPendingMalpractice: [''],
      isConvictedVilationOfLaw: [''], 
 
      isProblemWithDrugAlcohol: [''],
      isDeclinedanyInsuraceCompany: [''],
      isPhysicalConditionFine: [''],
      //explanationNotes: ['', Validators.required] 
    });

    this.getProviderInformation();
    this.profession = this.objProviderInfo.profession;
    //this.providerInfo.professions = this.profession;

    // this.countryFormControl.valueChanges
    // .subscribe(country => console
    // .log('this.countryFormControl.valueChanges', country));
     
  }

  get f(){
    return this.basicForm.controls;
  }

  
  ngAfterViewInit(): void {
    try{
      this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
    }
    catch{ }   
  }

  changeColor() {
    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);
    const color = 'rgb(' + r + ',' + g + ',' + b + ')';
    this.signaturePad.penColor = color;
  }

  clear() {
    this.signaturePad.clear();
  }

  undo() {
    const data = this.signaturePad.toData();
    if (data) {
      data.pop(); // remove the last dot or line
      this.signaturePad.fromData(data);
    }
  }

  dataURLToBlob(dataURL) {
    // Code taken from https://github.com/ebidel/filer.js
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }

  updateValues(skill: any, value: boolean, index: number){
    //console.log(skill, value);  
    if(this.providerInfo.profession == undefined || this.providerInfo.profession == null)
    {
      this.providerInfo.profession = this.profession;
    }
    this.providerInfo.profession[index].selected = value;
  }

  getProviderInformation() {
    this.userDetails.UserId = parseInt(localStorage['userId']);
    this.userDetails.Mode = "Select";
    this.providerService.getProviderInformation(this.userDetails).subscribe(response=>{
      this.providerInfo = response; 
      if(response.mode == "Insert")
      { 
        this.providerInfo.submittedDate = null;
        this.providerInfo.dob = null;
        this.providerInfo.isBoardCertified = '';
        this.providerInfo.isBoardEligible = ''
        this.providerInfo.isConvictedVilationOfLaw = '';

        this.providerInfo.isDeclinedanyInsuraceCompany = '';
        this.providerInfo.isDiciplinaryByOthers = '';
        this.providerInfo.isFullTimeJob = null
        this.providerInfo.isHospitalPrivilegesDenied = '';
        this.providerInfo.isOwnPractice = '';
        
        this.providerInfo.isPendingMalpractice = '';
        this.providerInfo.isPhysicalConditionFine = '';
        this.providerInfo.isProblemWithDrugAlcohol = '';
        this.providerInfo.isStateProfessionalLicense = '';
        this.providerInfo.medicareValidation = '';
        this.providerInfo.gender = '';
        this.providerInfo.contactPerson = '';

      } 
      
      //console.log(response) 
      if(!isNullOrUndefined(response.professionList)) {
        let orginalData =  response.professionList.replace(/\\/g,'');
        this.providerInfo.profession = JSON.parse(orginalData);
        this.profession = this.providerInfo.profession; 
      }
      else {
        this.providerInfo.profession = this.profession;
      }

      if(!isNullOrUndefined(response.deaRegistraionStatus)) {
        let orginalData =  response.deaRegistraionStatus.replace(/\\/g,'');
        this.deaRegistraionStatus = JSON.parse(orginalData);
      }

      //this.providerService.setProviderInfoServiceDetails(response);

      // if(!isNullOrUndefined(this.providerInfo.country)) {
      //   //let orginalData =  this.providerInfo.country.replace(/\\/g,'');
      //   this.country = JSON.parse(this.providerInfo.country);
      //   this.providerInfo.country =  JSON.parse(this.providerInfo.country);
      // } 

      // if(!isNullOrUndefined(this.providerInfo.practiceCountry)) {
      //   this.practiceCountry = JSON.parse(this.providerInfo.practiceCountry);
      //   this.providerInfo.practiceCountry =  JSON.parse(this.providerInfo.practiceCountry);
      // } 

      this.signatureUrl = this.dynamicServiceUrls.blobUrl + this.providerInfo.signatureName; 
      this.loadSignature(this.providerInfo.isBlobExist)   
    })
  }

  loadSignature(isblobExist: boolean){
    setTimeout(() => {
      this.showSignaturePad = !isblobExist;
      try {
        this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
      }
      catch { }  
    }, 1000);
  }

  // onCountrySelected($event: Country, isPracticeCountry: boolean) {
  //   //console.log($event);
  //   if(isPracticeCountry) {
  //     this.providerInfo.practiceCountry = $event;
  //   }
  //   else
  //   {
  //     this.providerInfo.country = $event;
  //   } 
  // }

  files: any[] = [];

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);

    //console.log(this.files)
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  uploadImage() {
    this.showSignaturePad = true;
  }

  // onFileChange(event) {
  //   this.theFile = null;
  //   if (event.target.files && event.target.files.length > 0) {
  //       // Don't allow file sizes over 1MB
  //       if (event.target.files[0].size < this.MAX_SIZE) {
  //           // Set theFile property
  //           this.theFile = event.target.files[0];
  //       }
  //       else {
  //           // Display error message
  //           this.messages.push("File: " + event.target.files[0].name + " is too large to upload.");
  //       }
  //   }
  // }

  onFileChange(event) {
    this.theFiles = [];
    
    // Any file(s) selected from the input?
    if (event.target.files && event.target.files.length > 0) {
        for (let index = 0; index < event.target.files.length; index++) {
            let file = event.target.files[index];
            // Don't allow file sizes over 1MB
            if (file.size < this.MAX_SIZE) {
                // Add file to list of files
                this.theFiles.push(file);
            }
            else {
                this.messages.push("File: " + file.name + " is too large to upload.");
            }
        }
    }
}


  private readAndUploadFile(theFile: any) {
    let file = new FileToUpload();
    
    // Set File Information
    file.fileName = theFile.name;
    file.fileSize = theFile.size;
    file.fileType = theFile.type;
    file.lastModifiedTime = theFile.lastModified;
    file.lastModifiedDate = theFile.lastModifiedDate;
    
    // Use FileReader() object to get file to upload
    // NOTE: FileReader only works with newer browsers
    let reader = new FileReader();
    
    // Setup onload event for reader
    reader.onload = () => {
        // Store base64 encoded representation of file
        file.fileAsBase64 = reader.result.toString();
        
        // POST to server
        this.providerService.uploadFile(file).subscribe(resp => { 
            this.messages.push("Upload complete"); });
    }
    
    // Read the file
    reader.readAsDataURL(theFile);
  }

  uploadFile(): void {
    this.theFiles = this.files;
    for (let index = 0; index < this.theFiles.length; index++) {
        //this.readAndUploadFile(this.theFiles[index]);
        //this.upload2(this.theFiles);
        this.uploadFile2(this.theFiles);
    }
  }

  public uploadFile2 = (files) => {
    if (files.length === 0) {
      return;
    }
  
    let filesToUpload : File[] = files;
    const formData = new FormData();
      
    Array.from(filesToUpload).map((file, index) => {
      return formData.append('file'+index, file, file.name);
    });
  
    this.providerService.AddFileDetails(formData).subscribe(event => {
      console.log(event);
    });
  }

  upload2(files) {
    if (files.length === 0)
      return;
    const formData = new FormData();
    for (let file of files)
      formData.append(file.name, file);
      
    const uploadReq = new HttpRequest('POST', 'https://localhost:44316/Provider/UploadDocument', formData, {
      reportProgress: true,
    });
    this.http.request(uploadReq).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress)
        this.progress = Math.round(100 * event.loaded / event.total);
      else if (event.type === HttpEventType.Response)
        this.message = event.body.toString();
    });
  }

  uploadSignature() 
  {
    //console.log(this.signaturePad); 
    var dataURL = '';
    var signArray = []; // this.signaturePad;
    signArray.push(this.signaturePad)
    var signArrayLenth=Object.keys(signArray).length;
    var imgArr, imgdataArr = [], data;
    for (var i = 0; i < signArrayLenth; i++) {
        if (signArray[i] == '') {
            imgdataArr.push({ imgId: i, data: "" })
        }
        else {
            dataURL = signArray[i].toDataURL().replace('data:image/png;base64,', '');
            data = dataURL;
            imgdataArr.push({ imgId: i, data: data })
        }
    }

    let objData = JSON.stringify(imgdataArr);

    this.providerService.uploadImages(objData).subscribe(response=>{
      //console.log(response);
    });

    // const uploadReq = new HttpRequest('POST', 'https://localhost:44316/Provider/UploadImage', 
    // datas);
    // this.http.request(uploadReq).subscribe(event => {
    //   if (event.type === HttpEventType.UploadProgress)
    //     this.progress = Math.round(100 * event.loaded / event.total);
    //   else if (event.type === HttpEventType.Response)
    //     this.message = event.body.toString();
    // });
  }

  data:any=[];
  submitForm() {
      this.loading = true;
      let objDea = this.childDEARegistration.getDeaInfo(); 
      let objDeaStaus = this.childDEARegistration.getDeaStausInfo();
      let objLicense = this.childLicenseRegistrations.getLicenseInfo();
      let objProfessionalRef = this.childProfessionalReferences.getProfessionalReferenceInfo();
      //this.providerInfo.deaRegistrationsList = objDea;

      this.providerInfo.deaRegistrationsList = objDea.filter(function(obj){
        return obj.expirationDate!=null;
      });
      this.providerInfo.licenseRegistrationList = objLicense.filter((obj)=>{
        return obj.licenseExpirationDate!=null;
      });;

      this.providerInfo.professionalReferencesList = objProfessionalRef;
      this.providerInfo.deaRegistraionStatus = JSON.stringify(objDeaStaus);
      this.providerInfo.professionList = JSON.stringify(this.providerInfo.profession);
      this.providerInfo.isFullTimeJob = false;


      // Need to update in Ui
      // this.providerInfo.isFullTimeJob = "";
      // this.providerInfo.scheduledDays = "";
      // this.providerInfo.preferedTypeOfConsults = "";
      // this.providerInfo.scheduleComment = "";
      // this.providerInfo.cvFileName = "";
      // this.providerInfo.otherFileName = "";
      // this.providerInfo.signatureName = "";
      // this.providerInfo.explanationNotes = "";
      //ends 

      // let date = new Date(this.providerInfo.submittedDate);
      // date.setDate(date.getDate() + 1);
      // this.providerInfo.submittedDate = new Date(date);
    

      var signArray = []; // this.signaturePad;
      signArray.push(this.signaturePad)
      var signArrayLenth=Object.keys(signArray).length;  
      if(signArrayLenth>0) {
        this.providerInfo.signatureName = this.providerInfo.userId + "_signature.jpg";
      } 
      
      let isFormInvalid = this.basicForm.invalid ||  
      this.childLicenseRegistrations.activeLicenceForm.controls.activeArray.invalid ||
      this.childLicenseRegistrations.nonActiveLicenceForm.controls.nonActiveArray.invalid ||
      this.childDEARegistration.deaRegistrationForm.controls.deaArray.invalid ||
      this.childProfessionalReferences.professionalRefForm.controls.reference.invalid; 
      
      // alert(this.basicForm.invalid + " - Li active " + 
      // this.childLicenseRegistrations.activeLicenceForm.controls.activeArray.invalid  + " - Li - nonac " +
      // this.childLicenseRegistrations.nonActiveLicenceForm.controls.nonActiveArray.invalid + " - dea " +
      // this.childDEARegistration.deaRegistrationForm.controls.deaArray.invalid + " - prof " +
      // this.childProfessionalReferences.professionalRefForm.controls.reference.invalid)
      //return false;

      let obj = this.profession.filter((obj)=>{
        return obj.selected
      });
      
      if(isFormInvalid || obj.length==0)
      { 
        this.dynamicServiceUrls.openSnackBar('Form is incomplete', '');
        this.basicForm.markAllAsTouched();
        this.childLicenseRegistrations.activeLicenceForm.markAllAsTouched();
        this.childLicenseRegistrations.nonActiveLicenceForm.markAllAsTouched();
        this.childDEARegistration.deaRegistrationForm.markAllAsTouched();
        this.childProfessionalReferences.professionalRefForm.markAllAsTouched();
        this.loading = false;
        return; 
      }
      else
      {
        this.providerService.updateProviderInformation(this.providerInfo).subscribe(response => {
          //console.log(response);
          this.dynamicServiceUrls.openSnackBar('updated successfully', '');  
          this.loading = false;
          this.getProviderInformation();
        });   

        if(!this.providerInfo.isBlobExist && 
          !this.isCanvasBlank(this.signaturePadElement.nativeElement))
        {
          this.uploadSignature(); 
        }
        this.uploadFile();
      } 
  }

  isCanvasBlank(canvas) {
    const context = canvas.getContext('2d');

    const pixelBuffer = new Uint32Array(
      context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );

    return !pixelBuffer.some(color => color !== 0);
  }

}
