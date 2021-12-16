import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { AthenticationService } from '../../../service/athentication.service';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.scss']
})
export class EditNoteComponent implements OnInit {
  
  deliveryDate: Date = new Date();
  //endDate: Date = new Date();
  deliveryAgencies: any;

  editDeliveryForm = new FormGroup({
    deliveryNote: new FormControl('', [Validators.required]),
    deliveryDateForm: new FormControl(''),
    agencyId: new FormControl('', [Validators.required]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public adminService: AdminService, private route: Router,
    private athenticationService: AthenticationService, private dialog: MatDialog, public dialogRef: MatDialogRef<any>) {
  }

  ngOnInit(): void {
    console.log("On Init data from editNote : " + this.data);
    this.dialogRef.updateSize("30%");
    this.dialogRef.disableClose = true;
    this.getDeliveryAgencies();
    //this.editDeliveryForm.controls['pharmacyCHangeNote'].setValue(this.data.selectedElement.prescriptionNote ?? "");
  }

  getDeliveryAgencies() {
    this.adminService.getDeliveryAgencies().subscribe(data => {
      this.deliveryAgencies = data;
    });
  }

  onSubmit() {
    this.data.deliveryNote = this.editDeliveryForm.value["deliveryNote"];
    this.data.deliveryDate = this.adminService.returnFormatedDate2(this.editDeliveryForm.value["deliveryDateForm"]);
    this.data.deliveryAgencyId = this.editDeliveryForm.value["agencyId"];

    let message = "Is '" + this.data.deliveryNote + "' the correct tracking number?"

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: message,
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const a = document.createElement('a');
        a.click();
        a.remove();
        console.log("dataset after close : ");
        console.log(this.data);
        this.adminService.updateDeliveryNote(this.data).subscribe(data => {
          this.dialogRef.close();
        }, error => {

        });
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.editDeliveryForm.controls[controlName].hasError(errorName);
  }
}
