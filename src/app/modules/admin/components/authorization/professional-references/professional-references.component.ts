import { Input, SimpleChanges } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryList } from '../../../model/provider-information';
import { ProviderService } from '../../../service/provider.service';

@Component({
  selector: 'app-professional-references',
  templateUrl: './professional-references.component.html',
  styleUrls: ['./professional-references.component.scss']
})
export class ProfessionalReferencesComponent implements OnInit {

  public professionalRefForm: FormGroup
  public validationMsgs = {
    'emailAddress': [{ type: 'email', message: 'Enter a valid email' }]
  }
  showForm: boolean = false;

  @Input() professionalReferencesListIn : any;
  deletedReference: any = [];

  constructor(public fb: FormBuilder,
    private providerService: ProviderService,
    public countryList: CountryList) { }

  ngOnChanges() { 
    if(this.professionalReferencesListIn!=undefined) {
      this.professionalRefForm.controls.reference = this.fb.array([]);  
      const reference = this.professionalRefForm.get('reference') as FormArray;
      if (reference.length > 0) {
        reference.removeAt(0)
      } else {
        reference.reset()
      }
      this.updateForms(this.professionalReferencesListIn);
      this.deletedReference = [];
    }
    //console.log('ngOnChanges '+ this.professionalReferencesListIn);
  }

  updateForms(data: any){
    this.professionalReferencesListIn.forEach(element => {
      const reference = this.professionalRefForm.get('reference') as FormArray
      reference.push(this.createEmailFormGroup(element));
      this.showForm = true;
    });
  }

  ngOnInit() {
    // this.professionalRefForm2 = this.fb.group({
    //   firstName: ['', Validators.required], 
    //   //lastName: ['', Validators.required],
    //   mailingAddress: ['', Validators.required],
    //   city: ['', Validators.required],
    //   state: ['', Validators.required],
    //   zipCode: ['', Validators.required],
    //   country: ['', Validators.required],
    //   phoneNumber: ['', Validators.required],
    //   email:  ['', [Validators.required, Validators.email,
    //     Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]]
    // })
    //this.getProfessionalReferenceInfo();

    this.professionalRefForm = this.fb.group({
      reference: []
      //reference: this.fb.array([])
    });
  }

  private createEmailFormGroup(element: any = ''): FormGroup {
    if(element == '') {
      return new FormGroup
      ({     
          firstName: new FormControl('', Validators.required),  
          mailingAddress: new FormControl('', Validators.required),  
          city: new FormControl(''),  
          state: new FormControl(''),  
          zipCode: new FormControl(''),  
          country: new FormControl(''),  
          phoneNumber: new FormControl('', [Validators.required,Validators.pattern("^[0-9]*$")]),
          email: new FormControl('', [Validators.email, Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])
      });
    }
    else
    {
      let obj = new FormGroup
      ({     
        firstName: new FormControl('', Validators.required),  
        mailingAddress: new FormControl('', Validators.required),  
        city: new FormControl(''),  
        state: new FormControl(''),  
        zipCode: new FormControl(''),  
        country: new FormControl(''),  
        phoneNumber: new FormControl('', [Validators.required,Validators.pattern("^[0-9]*$")]),
        email: new FormControl('', [Validators.email, Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])
      });

      // obj.get('firstName').setValue(element.firstName);
      // obj.get('mailingAddress').setValue(element.mailingAddress);
      // obj.get('city').setValue(element.city);
      // obj.get('state').setValue(element.state);
      // obj.get('zipCode').setValue(element.zipCode);
      // obj.get('country').setValue(element.country);
      // obj.get('phoneNumber').setValue(element.phoneNumber);
      // obj.get('email').setValue(element.email); 
      return obj;
    } 
  }

  public addControls() {
    const reference = this.professionalRefForm.get('reference') as FormArray
    reference.push(this.createEmailFormGroup());

    // this.professionalRefForm = this.fb.group({
    //  reference: this.fb.array([this.createEmailFormGroup()])
    // });
    this.addReferences(); 
    this.showForm = true;  
    //reference[reference.length-1].reset();
  } 
 
  public removeControls(i: number) {
    const reference = this.professionalRefForm.get('reference') as FormArray
    if (reference.length > 0) {
      reference.removeAt(i)
    } else {
      reference.reset()
    }
    this.removeReferences(i);
    
  }


  get f() {
    return this.professionalRefForm.controls;
  } 

  addReferences()
  {   
    let data = { 
      id: 0,
      createdDate: new Date(),
      firstName: "",
      lastName: null,
      initial: null,
      mailingAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phoneNumber: "",
      mobileNumber: "",
      email: "",
      userId: parseInt(localStorage['userId']),
      mode: "Insert"
    } 
    this.professionalReferencesListIn.push(data);  
  } 

  removeReferences(index: number) {
    if(this.professionalReferencesListIn[index].mode == "Insert"){
      this.professionalReferencesListIn.splice(index, 1);
    }
    else
    {
      this.professionalReferencesListIn[index].mode = "Delete";
      this.deletedReference.push(this.professionalReferencesListIn[index])
      this.professionalReferencesListIn.splice(index, 1);
    } 
  }  

  getProfessionalReferenceInfo() {
    this.deletedReference.forEach((data: any)=>{
      this.professionalReferencesListIn.push(data);
    });
    return this.professionalReferencesListIn;
  }

  working(professionalReferencesListIn: any) {
    alert(professionalReferencesListIn)
  }
}
