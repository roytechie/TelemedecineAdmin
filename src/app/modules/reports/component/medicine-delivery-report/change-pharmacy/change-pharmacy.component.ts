import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/modules/admin/service/admin.service';
import { AthenticationService } from 'src/app/modules/admin/service/athentication.service';

@Component({
  selector: 'app-change-pharmacy',
  templateUrl: './change-pharmacy.component.html',
  styleUrls: ['./change-pharmacy.component.scss']
})
export class ChangePharmacyComponent implements OnInit {

  changePharmacyForm = new FormGroup({
    pharmacyCHangeNote: new FormControl('', [Validators.required]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public adminService: AdminService, private route: Router, 
  private athenticationService: AthenticationService, private dialog: MatDialog, public dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
    console.log(this.data)
    this.dialogRef.updateSize("30%");
    this.dialogRef.disableClose = true;
    this.changePharmacyForm.controls['pharmacyCHangeNote'].setValue(this.data.selectedElement.prescriptionNote ?? "");
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    let submittedData = {
      id: this.data.selectedElement.id,
      patientId: this.data.selectedElement.patientId,
      pharmacyId: this.data.selectedPharmacy.value,
      note:this.changePharmacyForm.value["pharmacyCHangeNote"]
    };
    this.adminService.updatePharmacyForMedicineDelivery(submittedData).subscribe(response => {
      this.dialogRef.close();
    }, error => {});
  }

}
