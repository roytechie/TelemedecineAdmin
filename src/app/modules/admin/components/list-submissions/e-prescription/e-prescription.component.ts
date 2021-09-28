import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { AthenticationService } from '../../../service/athentication.service';

@Component({
  selector: 'app-e-prescription',
  templateUrl: './e-prescription.component.html',
  styleUrls: ['./e-prescription.component.scss']
})
export class EPrescriptionComponent implements OnInit {

  displayPrint: boolean = true;
  prescribedMedicines: [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public adminService: AdminService, private route: Router,
  private athenticationService: AthenticationService, private dialog: MatDialog, public dialogRef: MatDialogRef<any>) {
}

  ngOnInit(): void {
    console.log(this.data);
    if(this.data.prescribedMedicine.length > 0) {
      let medicines = this.data.prescribedMedicine;
      this.prescribedMedicines = medicines.split('~');
      console.log(this.prescribedMedicines);
    }
  }

  printPrescription() {
    this.displayPrint = false;
    window.print();
  }

  closePrescription() {
    this.dialogRef.close();
  }

}
