import { Component, OnInit } from '@angular/core';
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
    else{
      let accessValue: AccessLavel = this.athenticationService.checkAccessLavel(this.athenticationService.currentUserValue);
      if(accessValue != AccessLavel.Admin) {
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


  updateFilter(event: any, filterType: string) 
  { 

    // if(filterType == 'symptomsFilter')
    // {
    //   if(event.value == 'All'){
    //     event.value = 'All,Covid,NonCovid';
    //   }
    //   if(event.value == 'Covid,NonCovid'){
    //     event.value = 'All,Covid,NonCovid';
    //   }
    //   this.symptomsFilter = event.value;
    // }
    // else
    // {
    //   this.statusFilter = event.value;
    // }

    let statusString; 

    if(this.statusFilter == '-1')
    {
      statusString = 'NoStatus';
    }
    else if(this.statusFilter == 7){
      statusString = 'Complete';
    }
    else
    {
      statusString = 'Status';
    }

    let searchString = this.symptomsFilter + 'with' + statusString;
    this.getFilterdResult(searchString);
  } 

  getFilterdResult(searchString: string){
    let status = parseInt(this.statusFilter);
    let completeStatusId = 7;

    switch(searchString) 
    {
      case 'AllwithNoStatus':  
        this.dataSource.data = this.dataSourceOriginal.filteredData.filter(function(item) { 
          return (item.status != completeStatusId);
        });
        break;

      case 'AllwithStatus':  
        this.dataSource.data = this.dataSourceOriginal.filteredData.filter(function(item) { 
          return (item.status != completeStatusId && item.status == status);
        });
        break;

      case 'AllwithComplete':  
        this.dataSource.data = this.dataSourceOriginal.filteredData.filter(function(item) { 
          return (item.status == completeStatusId);
        });
        break;

      case 'CovidwithNoStatus':  
        this.dataSource.data = this.dataSourceOriginal.filteredData.filter(function(item) { 
          return (item.isCovid == true && item.status != completeStatusId);
        });
        break;

      case 'CovidwithStatus':  
        this.dataSource.data = this.dataSourceOriginal.filteredData.filter(function(item) { 
          return (item.isCovid == true && item.status != completeStatusId && item.status == status);
        });
        break;

      case 'CovidwithComplete':  
        this.dataSource.data = this.dataSourceOriginal.filteredData.filter(function(item) { 
          return (item.isCovid == true && item.status == completeStatusId );
        });
        break;

      case 'NonCovidwithNoStatus':  
        this.dataSource.data = this.dataSourceOriginal.filteredData.filter(function(item) { 
          return (item.isCovid == false && item.status != completeStatusId );
        });
        break;

      case 'NonCovidwithStatus':  
        this.dataSource.data = this.dataSourceOriginal.filteredData.filter(function(item) { 
          return (item.isCovid == false && item.status != completeStatusId && item.status == status);
        });
        break;

      case 'NonCovidwithComplete':  
        this.dataSource.data = this.dataSourceOriginal.filteredData.filter(function(item) { 
          return (item.isCovid == false && item.status == completeStatusId );
        });
        break;     
        
      //This will be the cases when Both Covid And Non Covid Patients are evaluated
      case 'All,Covid,NonCovidwithNoStatus':  
        this.dataSource.data = this.dataSourceOriginal.filteredData.filter(function(item) { 
          return (item.status != completeStatusId );
        });
        break;

      case 'All,Covid,NonCovidwithStatus':  
        this.dataSource.data = this.dataSourceOriginal.filteredData.filter(function(item) { 
          return (item.status != completeStatusId && item.status == status);
        });
        break;

      case 'All,Covid,NonCovidwithComplete':  
        this.dataSource.data = this.dataSourceOriginal.filteredData.filter(function(item) { 
          return (item.status == completeStatusId );
        });
        break;
      
      //This will be the cases when neither Covid nor Non Covid Patients are evaluated
      case 'withNoStatus':  
        this.dataSource.data = this.dataSourceOriginal.filteredData.filter(function(item) { 
          return (item.status != completeStatusId );
        });
        break;

      case 'withStatus':  
        this.dataSource.data = this.dataSourceOriginal.filteredData.filter(function(item) { 
          return (item.status != completeStatusId && item.status == status);
        });
        break;

      case 'withComplete':  
        this.dataSource.data = this.dataSourceOriginal.filteredData.filter(function(item) { 
          return (item.status == completeStatusId );
        });
        break;
    }
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
