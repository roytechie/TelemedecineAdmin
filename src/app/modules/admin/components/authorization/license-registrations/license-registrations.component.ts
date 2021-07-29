import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LicenseRegistration } from '../../../model/license-registration';

@Component({
  selector: 'app-license-registrations',
  templateUrl: './license-registrations.component.html',
  styleUrls: ['./license-registrations.component.scss']
})
export class LicenseRegistrationsComponent implements OnInit, OnChanges {

  @Input() licenseRegistrationIn: any;
  tempRegistrationIn: LicenseRegistration;
  finalRowActiveData: number
  finalRowNonActiveData: number

  activeLicenceForm: FormGroup
  nonActiveLicenceForm: FormGroup  

  activeDeletedData: any = []
  nonActiveDeletedData: any = []

  activeLicence: any = [];
  nonActiveLicence: any = [];

  showForm: boolean

  constructor(private fb: FormBuilder) { }

  ngOnInit() { 

    this.activeLicenceForm = this.fb.group({
      activeArray: []
    });

    this.nonActiveLicenceForm = this.fb.group({
      nonActiveArray: []
    });
  }

  ngOnChanges() { 

    this.activeDeletedData = []
    this.nonActiveDeletedData = []  
    this.activeLicence = [];
    this.nonActiveLicence = [];

    if(this.licenseRegistrationIn!=undefined) {
      //console.log('ngOnChanges '+ this.licenseRegistrationIn);
      this.activeLicenceForm = this.fb.group({
        activeArray: this.fb.array([this.createEmailFormGroup()])
      });

      this.nonActiveLicenceForm = this.fb.group({
        nonActiveArray: this.fb.array([this.createEmailFormGroup()])
      }); 
      this.updateForms();

      const activeArray = this.activeLicenceForm.get('activeArray') as FormArray
      const nonActiveArray = this.nonActiveLicenceForm.get('nonActiveArray') as FormArray

      if(activeArray.length > 0) {
        activeArray.removeAt(0)
      } 
      else {
        activeArray.reset()
      } 

      if(nonActiveArray.length > 0) {
        nonActiveArray.removeAt(0)
      } 
      else {
        nonActiveArray.reset()
      }  
      this.activeDeletedData = [];
      this.nonActiveDeletedData = [];  

      this.showForm = true;
    }
    //console.log('ngOnChanges '+ this.professionalReferencesListIn);
  }

  updateForms(){
    const objActiveArray = this.activeLicenceForm.get('activeArray') as FormArray
    const objNonActiveArray = this.nonActiveLicenceForm.get('nonActiveArray') as FormArray
    this.licenseRegistrationIn.forEach(element => { 
      if(element.isActiveLicense)
      { 
        objActiveArray.push(this.createEmailFormGroup()); 
        this.activeLicence.push(element); 
      }
      else
      { 
        objNonActiveArray.push(this.createEmailFormGroup()); 
        this.nonActiveLicence.push(element);
      }     
    });   
  }

  private createEmailFormGroup(): FormGroup {    
      return new FormGroup
      ({     
          // licenseState: new FormControl('', Validators.required),  
          // licenseType: new FormControl('', Validators.required),  
          // licenseNumber: new FormControl('', Validators.required),  
          // licenseExpirationDate: new FormControl('', Validators.required),  

          licenseState: new FormControl(''),  
          licenseType: new FormControl(''),  
          licenseNumber: new FormControl(''),  
          licenseExpirationDate: new FormControl(''),  
      }); 
  }

  public addControls(isActiveLicence: boolean) {
    if(isActiveLicence){
      const activeArray = this.activeLicenceForm.get('activeArray') as FormArray
      activeArray.push(this.createEmailFormGroup()); 
    }
    else
    {
      const nonActiveArray = this.nonActiveLicenceForm.get('nonActiveArray') as FormArray
      nonActiveArray.push(this.createEmailFormGroup()); 
    } 
    this.addLicense(isActiveLicence);  
    this.showForm = true; 
  } 
 
  public removeControls(isActiveLicence : boolean, i: number) { 
    if(isActiveLicence)
    {
      const activeArray = this.activeLicenceForm.get('activeArray') as FormArray
      if (activeArray.length > 0) {
        activeArray.removeAt(i)
      } else {
        activeArray.reset()
      }
    }
    else
    {
      const nonActiveArray = this.nonActiveLicenceForm.get('nonActiveArray') as FormArray
      if (nonActiveArray.length > 0) {
        nonActiveArray.removeAt(i)
      } else {
        nonActiveArray.reset()
      }
    } 
    this.removeLicenseLicense(isActiveLicence, i);  
  }

  addLicense(isActive: boolean)
  {  
    // this.tempRegistrationIn = new LicenseRegistration();
    // this.tempRegistrationIn.set(this.licenseRegistrationIn.length + 1, isActive)  
    let data = {
      id: this.licenseRegistrationIn.length + 1,
      licenseState : "",
      licenseType : "",
      licenseNumber : "",
      licenseExpirationDate : null,
      isActiveLicense : isActive,
      createdDate : new Date(),
      mode : "Insert",
      userId : parseInt(localStorage['userId'])
    } 
    this.licenseRegistrationIn.push(data); 
    if(isActive){
        this.activeLicence.push(data);
    }
    else
    {
      this.nonActiveLicence.push(data)
    }
  }   

  removeLicenseLicense(isActive: boolean,index: number) 
  { 
      if(isActive)
      {
        if(this.activeLicence[index].mode == "Insert"){
          this.activeLicence.splice(index, 1);
        }
        else
        {
          this.activeLicence[index].mode = "Delete"; 
          this.activeDeletedData.push(this.activeLicence[index]);
          this.activeLicence.splice(index, 1); 
        } 
      }
      else
      { 
        if(this.nonActiveLicence[index].mode == "Insert") 
        {
          this.nonActiveLicence.splice(index, 1);
        }
        else
        {
          this.nonActiveLicence[index].mode = "Delete"; 
          this.nonActiveDeletedData.push(this.nonActiveLicence[index]);
          this.nonActiveLicence.splice(index, 1);  
        } 
      } 
  }

  retrunFilterdData(isActive: boolean){
     return this.licenseRegistrationIn.filter(obj=>{
      return obj.isActiveLicense == isActive;
    })
  } 

  getLicenseInfo() {
    let result = [];

    this.activeLicence.forEach((data: any)=>{
      result.push(data);
    });

    this.nonActiveLicence.forEach((data: any)=>{
      result.push(data);
    });

    this.activeDeletedData.forEach((data: any)=>{
      result.push(data);
    });

    this.nonActiveDeletedData.forEach((data: any)=>{
      result.push(data);
    });

    return result;
  }
}
