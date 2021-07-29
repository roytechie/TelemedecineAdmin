import { Component, OnInit, Inject} from '@angular/core'; 
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { ListSubmissionsComponent } from '../../list-submissions/list-submissions.component';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-update-submission-dialog',
  templateUrl: './update-submission-dialog.component.html',
  styleUrls: ['./update-submission-dialog.component.scss']
})
export class UpdateSubmissionDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ListSubmissionsComponent>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
