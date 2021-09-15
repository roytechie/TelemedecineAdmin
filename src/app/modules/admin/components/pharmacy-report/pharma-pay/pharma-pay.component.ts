import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { AthenticationService } from '../../../service/athentication.service';

@Component({
  selector: 'app-pharma-pay',
  templateUrl: './pharma-pay.component.html',
  styleUrls: ['./pharma-pay.component.scss']
})
export class PharmaPayComponent implements OnInit {

  pharmaPayForm = new FormGroup({
    pharmaPayNote: new FormControl('', [Validators.required])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public adminService: AdminService, private route: Router,
    private athenticationService: AthenticationService, private dialog: MatDialog, public dialogRef: MatDialogRef<any>) {
  }

  ngOnInit(): void {
    this.dialogRef.updateSize("30%");
  }

  pharmaPaySubmit() {
    let model = {
      pharmaPayNote: this.pharmaPayForm.value["pharmaPayNote"],
      pharmacyReporResponsets: this.data
    }

    this.adminService.updatePharmaPayDetails(model).subscribe(data => {
      this.dialogRef.close();
    }, error => {});
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
