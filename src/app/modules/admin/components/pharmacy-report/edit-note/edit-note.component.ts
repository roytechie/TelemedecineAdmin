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

  editDeliveryForm = new FormGroup({
    deliveryNote: new FormControl('', [Validators.required]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public adminService: AdminService, private route: Router,
    private athenticationService: AthenticationService, private dialog: MatDialog, public dialogRef: MatDialogRef<any>) {
  }

  ngOnInit(): void {
    console.log(this.data)
    this.dialogRef.updateSize("30%");
    this.dialogRef.disableClose = true;
    //this.editDeliveryForm.controls['pharmacyCHangeNote'].setValue(this.data.selectedElement.prescriptionNote ?? "");
  }

  onSubmit() {
    this.data.deliveryNote = this.editDeliveryForm.value["deliveryNote"];
    
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
}
