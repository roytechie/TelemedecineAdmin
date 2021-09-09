import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { EmailProperties } from '../../model/email-properties';
import { AccessLavel } from '../../model/login-details';
import { AdminService } from '../../service/admin.service';
import { AthenticationService } from '../../service/athentication.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-sendmail-patient',
  templateUrl: './sendmail-patient.component.html',
  styleUrls: ['./sendmail-patient.component.scss']
})
export class SendmailPatientComponent implements OnInit {

  emailprop: EmailProperties;

  startDate: Date = new Date();
  endDate : Date = new Date();

  symptomsFilter: string;
  statusFilter: any = '-1';

  dataSource = new MatTableDataSource<any>(); 
  dataSourceOriginal = new MatTableDataSource<any>();

  /**************************************************/
  @ViewChild('select') select: MatSelect;

  allSelectedPatientStatus=false;

  //Patient Status To Be Shown In The DropDown
  patientStatusMultiSelectDropDown: any[] = [
    {value: '1', viewValue: 'Pending'},
    {value: '2', viewValue: 'Under Review'},
    {value: '3', viewValue: 'Prescription Advice'},
    {value: '4', viewValue: 'Appointment Fixed'},
    {value: '5', viewValue: 'No Answer'},
    {value: '6', viewValue: 'Followup'},
    {value: '7', viewValue: 'Complete'},
    {value: '8', viewValue: 'Refund'},
    {value: '9', viewValue: 'Recovered'},
    {value: '10', viewValue: 'NP'}
  ];

  toggleAllSelectionPatientStatus(event: any) {
    if (this.allSelectedPatientStatus) {
      this.select.options.forEach((item: MatOption) => item.select());
      this.select.options.forEach(element => {
        this.symptomsFilter
      });
      //this.symptomsFilter
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
    this.optionClickPatientStatus(event);   
  }
  optionClickPatientStatus(event: any) {
    let newStatus = true;
    var count1:number = 0;
    var statusInfo:string = "";
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
      
      if(item.selected == true){
        if(statusInfo == "")
        {
          statusInfo = item.value;
        }
        else{
          statusInfo = statusInfo + "," + item.value;
        }

      }

    });
    //event.value = statusInfo;
    //console.log("** StatusInfo : " + statusInfo);
    //this.updateFilter(event, 'symptomsFilter'); 
    this.statusFilter = statusInfo;
    
    this.allSelectedPatientStatus = newStatus;
  }

  /**************************************************/





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

  constructor(public adminService: AdminService, private dialog: MatDialog, private route: Router, private athenticationService: AthenticationService) {
    if(this.athenticationService.currentUserValue==null) {
      this.route.navigate(['/login']);
    }
    else {
      let accessableMenues = JSON.parse(localStorage.getItem("accessableMenues"));
        if(accessableMenues) {
          if(accessableMenues.filter(f => f.code == 9).length <= 0) {
            this.route.navigate(['/login']);
          }
        }
        else {
          this.route.navigate(['/login']);
        }
      }
   }

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
          message: 'Are you sure want to send email to selected patients?',
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
            EmailBody: this.emailForm.value['body'],
            StartDate: this.adminService.returnFormatedDate(this.startDate),
            EndDate: this.adminService.returnFormatedDate(this.endDate),
            Status: this.statusFilter < 0 ? null:this.statusFilter
          };
  
          console.log("Subject : " + this.emailprop.Subject);
          console.log("EmailBody : " + this.emailprop.EmailBody);
          console.log("StartDate : " + this.emailprop.StartDate);
          console.log("EndDate : " + this.emailprop.EndDate);
          console.log("Status : " + this.emailprop.Status);

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
