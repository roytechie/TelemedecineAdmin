import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../../service/admin.service';
import {ThemePalette} from '@angular/material/core';
import { identifierModuleUrl } from '@angular/compiler';
 

@Component({
  selector: 'app-doctors-form',
  templateUrl:'./doctors-form.component.html',
  styleUrls: ['./doctors-form.component.scss']
})
export class DoctorsFormComponent implements OnInit {

  pharmacyList: any;
  pharmacy: any = ''; 
  changedData: any;
  priscribedData : any ;
  JSON: any;  
  pharmacyID : number;  
  allComplete: boolean = false;  
  constructor(private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data:any,) { 
      this.JSON = JSON;
    }

  ngOnInit() {
    this.getPharmacyDetails();
    this.getMedicineDetails(this.data.submissionId);
    this.getPriscriptionDetails();

  }

  updatePharmacyValue(event: any){    
    //console.log(event);
    //this.getMedicineDetails(this.data.submissionId);   
  }

  
  getPharmacyDetails() {
      this.adminService.getPharmacyDetails().subscribe(response=>{
          this.pharmacyList = response;
          //console.log(response);
          let filterKey = localStorage.pharmacyValue != "" ? 
          localStorage.pharmacyValue : this.data.pharmacySequenceId;
          let selectedData = this.pharmacyList.filter(response=>{
            return response.pharmacySequenceId == filterKey;
          }); 

          if(selectedData.length > 0){
            this.pharmacy = selectedData[0];
          } 
      })
  }  

  updateAllComplete(event: any) {
    var data = this.changedData;  
    this.allComplete = this.changedData!= null && this.changedData.every(t => t.value);  
   //this.allComplete = this.changedData != null && this.changedData.every(t => t.value);    
  }

  updatePharmacyDetails() {   
    if(this.pharmacy != ""){
      this.adminService.updatePharmacyDetails(this.pharmacy,this.data.submissionId).subscribe(response=>{
        this.updateMedicineDetails();
        this.getPriscriptionDetails();
        this.adminService.openSnackBar('updated successfully', '');        
        localStorage.pharmacyValue = this.pharmacy.pharmacySequenceId;
        });
      }  
    }
    
    updateMedicineDetails()
    {
      var medicine = this.changedData;
      this.adminService.insertMedicineDetails(medicine,this.data.submissionId).subscribe(response=>{        
        });      
    }

    getPriscriptionDetails()
    {               
      this.adminService.getPriscriptionDetails(this.data.submissionId).subscribe(response=>{
        this.priscribedData = response;        
    })      
    }
    getMedicineDetails(Id : number)
    {    
      this.pharmacyID = Id;
      this.adminService.getMedicineDetails(this.pharmacyID).subscribe(response=>{
      this.changedData = response;    
      this.allComplete = this.changedData!= null && this.changedData.every(t => t.value);       
    })
    }
    setAll(completed: boolean) {
      this.allComplete = completed;      
      if (this.changedData == null) {
        return;
      }
      this.changedData.forEach(t => t.value = completed);            
    }

    someComplete(): boolean {
      if (this.changedData == null) {
        return false;
      }
      return this.changedData.filter(t => t.value).length > 0 && !this.allComplete;
    }
}
