import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DEARegistration } from '../../../model/dearegistration'; 
import { ProviderService } from '../../../service/provider.service'; 

@Component({
  selector: 'app-dearegistration',
  templateUrl: './dearegistration.component.html',
  styleUrls: ['./dearegistration.component.scss']
})
export class DEARegistrationComponent implements OnInit  {

  @Input() deaRegistrationsListIn : any;
  @Input() deaRegistraionStatusIn : any ; 

  providerInfo: any;
  tempDeaRegistration: DEARegistration;
  public deaRegistrationForm: FormGroup
  showForm: boolean = false;
  deletedDea: any =[];
  isRequired: boolean = false;

  constructor(public dEARegistration: DEARegistration,
    private providerService: ProviderService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.deaRegistrationForm = this.fb.group({
      deaArray: []
    });
  }

  ngOnChanges() { 
    if(this.deaRegistrationsListIn!=undefined) {
      this.deaRegistrationForm.controls.deaArray = this.fb.array([]);
      //console.log('ngOnChanges '+ this.deaRegistrationsListIn);   
      const deaArray = this.deaRegistrationForm.get('deaArray') as FormArray;
      if (deaArray.length > 0) {
        deaArray.removeAt(0)
      } else {
        deaArray.reset()
      } 
      this.deletedDea = [];
      this.updateForms(this.deaRegistrationsListIn);
    }
    //console.log('ngOnChanges '+ this.professionalReferencesListIn);
  }

  updateForms(data: any) { 
    this.deaRegistrationsListIn.forEach(element => {
      const deaArray = this.deaRegistrationForm.get('deaArray') as FormArray
      deaArray.push(this.createEmailFormGroup()); 
    });
    this.showForm = true;
  }


  updateValues(value: boolean, index: number){ 
    this.deaRegistraionStatusIn[index].selected = value;
    //console.log(this.deaRegistraionStatusIn); 
  }  
  
  private createEmailFormGroup(): FormGroup { 
      return new FormGroup
      ({     
          // deaNumber: new FormControl('' ,Validators.required),  
          // expirationDate: new FormControl('' ,Validators.required), 
          deaNumber: new FormControl(''),  
          expirationDate: new FormControl(''), 
      }); 
  }

  public addControls() {
    const deaArray = this.deaRegistrationForm.get('deaArray') as FormArray
    deaArray.push(this.createEmailFormGroup()); 
    this.addRegistration();  
    this.showForm = true; 
    //this.updateValidation(deaArray.controls[deaArray.length-1], '');
  } 

  addValidators(controlName: string, index: number) { 
    let deaNumber = this.deaRegistrationForm.get('deaArray') as FormArray
    if(controlName=='deaNumber') {
      this.updateValidation(deaNumber.controls[index], 'deaNumber');
    }
    //deaNumber.updateValueAndValidity();   
  }
  

  updateValidation(control:any, controlName: string) {
    // if(controlName == 'deaNumber')
    // {
    //   control.controls.deaNumber.setValidators(Validators.required);
    //   control.controls.expirationDate.setValidators(Validators.required);
    // }   
    // control.updateValueAndValidity();

    setTimeout(() => {
      // control.controls.deaNumber.setValidators(Validators.required);
      // control.controls.expirationDate.setValidators(Validators.required);
      // control.updateValueAndValidity();
      //this.deaRegistrationForm.markAsUntouched();

      // control.controls.deaNumber.setErrors({required : true});
      // control.controls.expirationDate.setErrors({required : true});
      // control.updateValueAndValidity();
    }, 1000);
  }
 
  public removeControls(i: number) {
    const deaArray = this.deaRegistrationForm.get('deaArray') as FormArray 
    if (deaArray.length > 0) {
      deaArray.removeAt(i)
    } else {
      deaArray.reset()
    }
    this.removeRegistration(i);    
  }

  get f(){
    return this.deaRegistrationForm.controls;
  } 

  addRegistration()
  {  
    //this.tempDeaRegistration = new DEARegistration();

    let data = { 
          id : 0,
          deaRegistrationNumber : null,
          expirationDate : null,
          createdDate : new Date(),
          userId : parseInt(localStorage['userId']),
          mode : "Insert" 
    }
    //this.tempDeaRegistration.set(this.dEARegistration.RegistrationStatus.length + 1)
    this.deaRegistrationsListIn.push(data);  
  } 

  removeRegistration(index: number) {
    if(this.deaRegistrationsListIn[index].mode == "Insert"){
      this.deaRegistrationsListIn.splice(index, 1);
    }
    else
    {
      this.deaRegistrationsListIn[index].mode = "Delete";
      this.deletedDea.push(this.deaRegistrationsListIn[index])
      this.deaRegistrationsListIn.splice(index, 1);
    } 
  }

  getDeaInfo(){
    this.deletedDea.forEach((data: any)=>{
      this.deaRegistrationsListIn.push(data);
    });
    return this.deaRegistrationsListIn;
  }

  getDeaStausInfo(){
    return this.deaRegistraionStatusIn;
  }

}
