import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { EmailProperties } from '../../model/email-properties';
import { AdminService } from '../../service/admin.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-sendmail-patient',
  templateUrl: './sendmail-patient.component.html',
  styleUrls: ['./sendmail-patient.component.scss']
})
export class SendmailPatientComponent implements OnInit {

  emailprop: EmailProperties;

  emailForm = new FormGroup({
    subject: new FormControl('', [Validators.required]),
    body: new FormControl('<font face="Calibri" size="3">Hello @Name,</font><div><font face="Calibri" size="3"><br></font></div><div><font face="Calibri" size="3">Type your text here...</font></div><div><font face="Calibri" size="3"><br></font></div><div><font face="Calibri" size="3">Thanks and Regards,</font></div><div><font face="Calibri" size="3"> <img src="https://frontlinemds.com/intakeform/admin/assets/drstella_logo.png"></font></div>')
 });

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Email Content...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Calibri',
    toolbarHiddenButtons: [
      ['customClasses',
      'link',
      'unlink',
      'insertImage',
      'insertVideo',
      'insertHorizontalRule',
      'removeFormat',
      'toggleEditorMode']
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  constructor(public adminService: AdminService, private dialog: MatDialog) { }

  ngOnInit(): void {

  }

  openAlertDialog(alertMessage: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        message: alertMessage,
        buttonText: {
          cancel: 'OK'
        }
      },
    });
  }

  sendMailWithConfirmation() {
    if (this.emailForm.invalid) {
      console.log(this.emailForm.value['body']);
        return;
     }
     else{
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: 'Are you sure want to send email to all patients?',
          buttonText: {
            ok: 'Send',
            cancel: 'No'
          }
        }
      });
  
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          const a = document.createElement('a');
          a.click();
          a.remove();

          this.emailprop = {
            Subject: this.emailForm.value['subject'],
            EmailBody: this.emailForm.value['body']
          };
  
          this.adminService.sendmailToAllPatient(this.emailprop).subscribe(response => {
            if(response == true){
              //this.emailForm.reset();
              this.openAlertDialog("Mail has been sent successfuly !");
            }
            else{
              this.openAlertDialog("error occurred during mail send.");
            }
            
          },
          error =>{
            console.log("error occurred during mail send.")
          });
        }
      });
     }
    
  }

}
