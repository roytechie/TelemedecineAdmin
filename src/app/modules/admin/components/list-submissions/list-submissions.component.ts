import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { AdminService } from '../../service/admin.service'; 
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ViewSubmissionComponent } from '../view-submission/view-submission.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DynamicServiceUrls } from 'src/app/shared/model/dynamic-service-urls';
import { AthenticationService } from '../../service/athentication.service';
import { isNullOrUndefined } from 'util';
import { AccessLavel, ReportRequest } from '../../model/login-details';
import { UpdateSubmissionDialogComponent } from '../authorization/update-submission-dialog/update-submission-dialog.component';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ProviderService } from '../../service/provider.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
 
@Component({
  selector: 'app-list-submissions',
  templateUrl: './list-submissions.component.html',
  styleUrls: ['./list-submissions.component.scss']
})
export class ListSubmissionsComponent implements OnInit, AfterViewInit  {  
  patientsList: any
  displayedColumns: string[] = ['submissionId', 'firstName', 'lastName', 'DOB',
   'phone', 'isCovid', 'submissionTime', 'state','doctorName', 'transactionDescription', 'returningPatient', 'status', 'Action'];
  covidQuestions : number [];

  displayedColumnForExcel: string[] = [
    'PatientFirstName',	'PatientMiddleName'	,'PatientLastName',	'PatientDOB',
    'PatientGender','PatientAddressLine1','PatientAddressLine2','PatientCity',
    'PatientState',	'PatientZipcode',	'PatientPhoneNumber',	'PatientEmail',	'ClinicName',
    'PrescriberFirstName','PrescriberMiddleName',	'PrescriberLastName',	'PrescriberNPI',	'PrescriberDEA',
    'PrescriberStateLicense',	'PrescriberAddressLine1',	'PrescriberAddressLine2',	'PrescriberCity',
    'PrescriberState',	'PrescriberZipcode','PrescriberPhoneNumber',	'PrescriberFaxNumber',
    'PrescribedMedicationDiscription',	'PrescribedMedicationQTY',	'PrescribedMedicationDirections',
    'PrescribedRefills',	'DAWCode',	'Notes',	'DigitalSignature'];

  dataSource = new MatTableDataSource<any>(); 
  dataSourceOriginal = new MatTableDataSource<any>();
  rowsAdded: boolean = false;
  exportButtonDisabled: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  animal: string;
  name: string;

  startDate: Date = new Date();
  endDate: Date = new Date();

  events: string[] = [];
  isCovid: boolean = false;
  symptomsFilter: string; // = "All";
  statusFilter: any = '-1';
  isTodayList: boolean = false;
  JSON: any;
  disabledButton : boolean = false;
  showNoRecordsDiv: boolean = false;
  fileName= 'Sheet.xlsx';
  statusList: any;

  constructor(public adminService: AdminService,public dialog: MatDialog,
    private router: Router,
    public dynamicServiceUrls: DynamicServiceUrls,
    private athenticationService: AthenticationService,
    private reportRequest: ReportRequest,
    public dialogUpdateSubmission: MatDialog,
    private providerService: ProviderService) { 
      if(isNullOrUndefined(this.athenticationService.currentUserValue)) { 
        this.router.navigate(['/login']);
      }
      else {
        let accessValue: AccessLavel;
        accessValue = this.athenticationService.checkAccessLavel(this.athenticationService.currentUserValue);
        this.athenticationService.defaultRerirectionAfterLogin(accessValue);
      }
      this.JSON = JSON;
      localStorage.pharmacyValue = "";
    } 

    openUpdateDialog(): void {
      const dialogRef = this.dialog.open(UpdateSubmissionDialogComponent, {
        width: '650px',
        data: {name: this.name, animal: this.animal}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.animal = result;
      });
    }    

  addEvent(eventName: string, event: MatDatepickerInputEvent<Date>) 
  {
    if(eventName == 'from') {
      this.startDate = event.value;
    }
    else {
      this.endDate = event.value;
    } 
  }

  ngOnInit() {
    this.showNoRecordsDiv = false;
    //this.getPatientsList(this.isTodayList);
    localStorage['userId'] = JSON.parse(localStorage.currentUser).id;
    //this.getXMLFile();
  }

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
  }

  getStatusDetails(input : any){ 
    return this.adminService.patientStatuses.filter(function(item) {
      return (item.value == input);
    });
  }

  getPatientsList(isTodayList: boolean, isTest: boolean = false): any {

    this.statusFilter = '-1';
    this.symptomsFilter; // = 'All';
    this.exportButtonDisabled = false;
    var newEndDate: Date = this.endDate;

    if(isTodayList)
    {
      this.startDate = new Date();
      //newEndDate.setDate(this.startDate.getDate() + 1);
      this.endDate = new Date();// newEndDate;
    }
    else
    { 
      //newEndDate.setDate( newEndDate.getDate() + 1 ) 
    }  

    this.disabledButton = true;
    this.reportRequest.startDate = this.adminService.returnFormatedDate(this.startDate);
    this.reportRequest.endDate = this.adminService.returnFormatedDate(this.endDate);;
    this.reportRequest.isAdmin = JSON.parse(localStorage.currentUser).isAdmin;
    this.reportRequest.userId = JSON.parse(localStorage.currentUser).id;
    this.reportRequest.isSingleSubmission = false;
    this.reportRequest.reportType = 'Submission';
    this.reportRequest.symptomList = this.symptomsFilter;

    if (this.reportRequest.symptomList == undefined || this.reportRequest.symptomList == null || this.reportRequest.symptomList == "") {
      this.reportRequest.symptomList = "All";
    }



    this.adminService.getPatientsList(this.reportRequest).subscribe(response=>{
      this.patientsList = response;
      console.log(this.patientsList);
      
      this.dataSource = new MatTableDataSource<any>(this.patientsList); // [...this.patientsList];
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.rowsAdded = this.dataSource.data.length > 0;  
     
      this.dataSourceOriginal = new MatTableDataSource<any>(this.patientsList); // [...this.patientsList];
      setTimeout(() => this.dataSourceOriginal.paginator = this.paginator);
      setTimeout(() => this.dataSourceOriginal.sort = this.sort);
      this.rowsAdded = this.dataSourceOriginal.data.length > 0;  
      this.disabledButton = false;
      this.showNoRecordsDiv = true;

      this.dataSource.data = this.dataSourceOriginal.filteredData.filter(function(item) { 
        return  (item.status != 7);
      });

      if(isTest)
      {
        return this.dataSource.data;
      }
    });
  }
  
  applyFilter(event: Event) {
    const symptomsFilter = (event.target as HTMLInputElement).value;
    this.dataSource.filter = symptomsFilter.trim().toLowerCase();
  }

  updateFilter(event: any, filterType: string) 
  { 
    if(filterType == 'symptomsFilter')
    {
      this.symptomsFilter = event.value;
    }
    else
    {
      this.statusFilter = event.value;
    }

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
    //console.log(searchString);
    this.getFilterdResult(searchString);
  } 
 
  viewSubscription(element: any){
    //this.router.navigate(['user/view-submission',element.submissionId]); 
    this.openDialog(element)
  }

  openDialog(patiantDetails: any) {  
    this.reportRequest.isAdmin = JSON.parse(localStorage.currentUser).isAdmin;
    this.reportRequest.userId = JSON.parse(localStorage.currentUser).id;
    this.reportRequest.isSingleSubmission = true;
    this.reportRequest.submissionId = patiantDetails.submissionId;
    this.reportRequest.reportType = 'Submission';
 
    this.adminService.getPatientsList(this.reportRequest).subscribe(response=>{
      patiantDetails = response[0]; 
      localStorage.patiantData = JSON.stringify(patiantDetails); 
      const dialogRef = this.dialog.open(ViewSubmissionComponent, { data : patiantDetails });

      dialogRef.afterClosed().subscribe(result => { 
        localStorage.pharmacyValue = "";  
        this.dataSource.data.filter(obj=> {
          if(obj.submissionId == result.SubmissionId) 
          {
              obj.activities = result.Activities;
              obj.activitiesDetails = result.ActivitiesDetails;
              obj.status = result.Status;
              obj.followupNotes = result.FollowupNotes;
              obj.notes = result.Notes;
              obj.doctorName = result.DoctorName;
              obj.loginDetails.userId = result.UserId; 
          }
        });
  
        this.dataSourceOriginal.data.filter(obj=> {
          if(obj.submissionId == result.SubmissionId) 
          {
              obj.activities = result.Activities;
              obj.activitiesDetails = result.ActivitiesDetails;
              obj.status = result.Status;
              obj.followupNotes = result.FollowupNotes;
              obj.doctorName = result.DoctorName;
              obj.loginDetails.userId = result.UserId;
          }
        }); 
      });
    });  
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
    }
  }

  downloadPDF(patientDetails){
    this.adminService.getAnswers(patientDetails).subscribe(response => {
      var answers = response;  
      console.log(answers);
        let docDefinition : any = {
          pageMargins: [40, 70, 40, 40],
          header : [
            {
              layout: 'lightHorizontalLines', // optional
              text: 'Frontline MDs Tele-Health Services', 
              style: 'header' ,
              color : 'blue'
            },
            { text : 'Dr.Stella Immanuel', fontSize : 13, alignment : 'center' },
            {text : '3603 South Street, Brookshire, TX 77423, Phone : +1 832 808 5574', fontSize:10, alignment: 'center'},
            {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595, y2: 5, lineWidth: 2, color : 'blue' }]},
          ],
          content: [          
          ],
          styles: {
            header: {
              fontSize: 16,
              bold: true,
              alignment : 'center'
            },
            subheader: {
              fontSize: 13, 
              bold: false,
              alignment : 'center'
            },
            question: {
              fontSize: 11,
              bold: false,
              alignment: 'left'
            },
            answer: {
              fontSize: 11,
              bold: true,
              alignment: 'left'
            }
          }
        };

        
         docDefinition.content.push(
          {
            layout: 'lightHorizontalLines', // optional
            text: 'Intake Form Submission', 
            style: 'subheader' 
          },
         );

        docDefinition.content.push(         
                {
                  columns: [
                    [
                      '\n',
                      'Submission Time : ' + new DatePipe("en-us").transform(patientDetails.submissionTime, "MM/dd/yyyy HH:mm:ss"),
                      'Assigned To : ' + patientDetails.doctorName,
                      'Has Covid Symptoms : ' + (patientDetails.isCovid ? 'Yes' : 'No'),
                      '\n'
                    ]
                  ,
                  [
                    '\n',
                    'Notes : ' + patientDetails.notes,
                    'Followup Notes : ' + patientDetails.followupNotes,
                  ],
                ]
              });      
        docDefinition.content.push({canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 2 }]});
        answers.forEach(step => {
          docDefinition.content.push( ['\n']);
          docDefinition.content.push({
            layout: 'lightHorizontalLines', // optional
            text: step.title, 
            style: 'subheader' 
          });
          docDefinition.content.push( ['\n']);
          step.questions.forEach(question => {
            if(question.type == "Notes"){
              docDefinition.content.push(question.question);
              docDefinition.content.push('\n');
            }
            else {
              docDefinition.content.push( {
                columns: [
                  [
                    { text : question.question, width : '60%'},
                    '\n'
                  ],
                  [
                    { text : question.answer, width : '40%', bold : true},
                    '\n'
                  ]
                ],
                columnGap: 10
              });
            }
          });
          docDefinition.content.push( ['\n']);
          docDefinition.content.push({canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 2 }]});
        });

        docDefinition.content.push({
          columns: [
              [
                '\n',
                '\n'
              ]
              ,
              
              [
                '\n',
                {image: 'data:image/jpeg;base64,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zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxjywiDzzzzjTzzzzzzzzzzTzzjTzyDzgTzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzjzzhzyDzzzzRzzzzzzzzzyzzygzzyzyxjzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzjzzzzwDzxyxTzzRzzzzzyyzzBzzixywhzzjTTzzzzzzzzzzzzzzzzzzzzzzzzzzzwzjzgQxwjwjzzzzzzjTzzTzjTzzxyDgziSzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzQCTxSjzgzzzTzzyzzxDzhTyxhyhjywRzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwijzxzSCxTzTzzSzjzSBCziBwzxjiRzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyjzTwxzwyzTyDzzyhzzxxzzyiSxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzhTwzzzzzzywzzzzyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzhyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz/2gAMAwEAAgADAAAAEPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPMPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP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',
                width: 150, alignment: 'right'
              },
              {text : 'Frontline MDs', alignment: 'right'},
              {text : 'Dr. Stella Immanuel MD', alignment: 'right'},
              {text : '3603 South Street, Brookshire, TX 77423',alignment: 'right'},
              {text : 'Phone : +1 832 808 5574', alignment: 'right'}
              ],
              
          ]
        ,
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            alignment : 'center'
          },
          subheader: {
            fontSize: 13, 
            bold: false,
            alignment : 'center'
          },
          leftalignedtext: {
            fontSize: 11,
            bold: false,
            alignment: 'left'
          },
          rightalignedtext:{
            fontSize: 11,
            bold: false,
            alignment: 'right'
          }
        }
      });

        pdfMake.createPdf(docDefinition).download('telemedicine-intake-' + patientDetails.submissionId.toString() + '.pdf');
    }); 
  } 

  downloadInvoicePDF(patientDetails){
    //console.log(patientDetails)
    this.adminService.getAnswers(patientDetails).subscribe(response => {
      console.log(response);
      var transactionDescription = response.transactionDescription
      var steps = response.surveySteps;  
      var answers: { [id: number] : string; } = {};
      steps.forEach(step => {
        step.questions.forEach(question => {
          answers[question.questionID] = question.answer;
        });
      });

      var itemdesc = transactionDescription;
      // if(patientDetails.isCovid)
      //   itemdesc = 'Medical Review Charges (Patient With Covid-19 Symptoms)'
      // else
      //   itemdesc = 'Medical Review Charges (Patient With No Covid-19 Symptoms)'
      var name = answers[1] + ' ' + answers[3];
      var address = answers[5] + '\n' + answers[6] + '\n' + answers[7] + ' ' + answers[8];
      
      let docDefinition : any = {
        content: [
          {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 2 }]},
          {
            layout: 'lightHorizontalLines', // optional
            text: 'Frontline MDs Tele-Health Services', 
            style: 'header' 
          },
          {
            layout: 'lightHorizontalLines', // optional
            text: 'Invoice', 
            style: 'subheader' 
          },
          {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 2 }]},
          {
            columns: [
              [
                '\n',
                {text : 'Bill To :', bold : true},
                name,
                address,
                '\n'
              ]
            ,
            [
              '\n',
              'Invoice # :'  +  patientDetails.submissionId.toString(),
              'Payment Reference Number : ' + patientDetails.authTranId, 
              // 'Date :' + new DatePipe('en-US').transform( new Date(), 'MM/dd/yyyy' ),
              'Date :' + new DatePipe('en-US').transform( patientDetails.submissionTime, 'MM/dd/yyyy' ), 
              '\n'
            ],
          ]
          },
          {
            layout: 'lightHorizontalLines', // optional
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: [ '10%', '30%', '20%', '20%' , '20%' ],
      
              body: [
                [ 'Sr #', 'Item', 'Price', 'Qty', 'Total' ],
                [ '1',  itemdesc + '\n\n\n', '$' + patientDetails.paymentAmount.toString(), '1', '$' + patientDetails.paymentAmount.toString() ],
                [ '', 'Total', '', '', '$' + patientDetails.paymentAmount.toString() ],
              ]
            }
          },
          {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 2 }]},
          {
            layout: 'lightHorizontalLines', // optional
            text: '\n\n\nThank you for your payment to Frontline MDs Tele-Health Services.\n', 
            style: 'subheader' 
          },
          {canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595-2*40, y2: 5, lineWidth: 2 }]},
        ],
        styles: {
          header: {
            fontSize: 16,
            bold: true,
            alignment : 'center'
          },
          subheader: {
            fontSize: 13, 
            bold: false,
            alignment : 'center'
          },
          leftalignedtext: {
            fontSize: 11,
            bold: false,
            alignment: 'left'
          },
          rightalignedtext:{
            fontSize: 11,
            bold: false,
            alignment: 'right'
          }
        }
      };
      pdfMake.createPdf(docDefinition).download('telemedicine-invoice-' + patientDetails.submissionId.toString() + '.pdf');
    });
  }
 
  getEscribeDetails(submissionId: number) {
    this.adminService.getEscribeDetails(submissionId).subscribe(response=>{
      // let xmlData = this.providerService.getEscriptXMLData(response);
      // let data = new Blob([xmlData], {type: 'text/xml'});        
      // var pom = document.createElement('a');
      // var filename = submissionId + "_escribe.xml";
      // var pom = document.createElement('a');  
      // pom.setAttribute('href', window.URL.createObjectURL(data));
      // pom.setAttribute('download', filename); 
      // pom.dataset.downloadurl = ['text/xml', pom.download, pom.href].join(':');
      // pom.draggable = true; 
      // pom.classList.add('dragout'); 
      // pom.click(); 
      //let url = window.URL.createObjectURL(data);
      //window.open(url);
 
      this.exportToExcel(response);

      // setTimeout(() => {
      //   this.exportToExcel(response);
      // },1000);
    });
  }

  exportToExcel(response: any): void
  { 
    let data = response;
    let readyToExport : any = [{
      PatientFirstName : JSON.parse(data.patiantInformation.profileDetails)[0].Answer,	
      PatientMiddleName : JSON.parse(data.patiantInformation.profileDetails)[1].Answer	,
      PatientLastName : JSON.parse(data.patiantInformation.profileDetails)[2].Answer,	
      PatientDOB : JSON.parse(data.patiantInformation.profileDetails)[8].Answer,
      PatientGender : JSON.parse(data.patiantInformation.profileDetails)[3].Answer,
      PatientAddressLine1 : JSON.parse(data.patiantInformation.profileDetails)[4].Answer,
      PatientAddressLine2 : null,
      PatientCity : JSON.parse(data.patiantInformation.profileDetails)[5].Answer,
      PatientState : JSON.parse(data.patiantInformation.profileDetails)[6].Answer,	
      PatientZipcode : JSON.parse(data.patiantInformation.profileDetails)[7].Answer,	
      PatientPhoneNumber: JSON.parse(data.patiantInformation.profileDetails)[9].Answer,
      PatientEmail : JSON.parse(data.patiantInformation.profileDetails)[10].Answer,
      ClinicName : 'Frontline MDs - Dr Stella Immanuel',
      PrescriberFirstName : data.providerInformation.firstName,
      PrescriberMiddleName : null,
      PrescriberLastName : data.providerInformation.lastName,	
      PrescriberNPI : data.providerInformation.npi,	
      PrescriberDEA : data.dea,
      PrescriberStateLicense : null,	
      PrescriberAddressLine1 : data.providerInformation.practiceAddress,	
      PrescriberAddressLine2 : null,	
      PrescriberCity : data.providerInformation.city,
      PrescriberState : data.providerInformation.state,	
      PrescriberZipcode : data.providerInformation.zipCode,
      PrescriberPhoneNumber : data.providerInformation.phoneNumber,	
      PrescriberFaxNumber : data.providerInformation.faxNumber,
      PrescribedMedicationDiscription : "'" + data.prescribedMedicationDiscription,	
      PrescribedMedicationQTY: null,
      PrescribedMedicationDirections : null,
      PrescribedRefills: null,	
      DAWCode: data.dawCode,	
      Notes : null,	
      DigitalSignature : 'Dr Stella Immanuel'
    }];

    /* pass here the table id */
    //let element = document.getElementById('excel-table');
    //const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(readyToExport)

    var header = Object.keys(readyToExport[0]); // columns name

    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // columns length added
        wscols.push({ wch: header[i].length + 5 })
    }
    ws['!cols'] = wscols;
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
     
    /* save to file */  
    XLSX.writeFile(wb, data.patiantInformation.submissionId + '_' + this.fileName, { bookType: 'xlsx', type: 'buffer' }); 
  }

  exportexcel() {
    //debugger;
    let fileName = 'Submissions.xlsx';
    /* table id is passed over here */
    let readyToExport = this.dataSource.data;

    for (var j in readyToExport) {
      //Remove Unwanted Columns
      delete readyToExport[j]["patientId"];
      delete readyToExport[j]["email"];
      delete readyToExport[j]["dobString"];
      delete readyToExport[j]["paymentTime"];
      delete readyToExport[j]["authTranId"];
      delete readyToExport[j]["notes"];
      delete readyToExport[j]["paymentAmount"];
      //delete readyToExport[j]["profileDetails"];
      delete readyToExport[j]["loginDetails"];
      delete readyToExport[j]["activities"];
      delete readyToExport[j]["followupNotes"];
      delete readyToExport[j]["activitiesDetails"];
      delete readyToExport[j]["userId"];
      delete readyToExport[j]["isAssigneeChanged"];
      delete readyToExport[j]["pharmacyName"];
      delete readyToExport[j]["pharmacySequenceId"];
      delete readyToExport[j]["lastUpdatedDate"];
      delete readyToExport[j]["otp"];
      delete readyToExport[j]["address"];
      delete readyToExport[j]["city"];
      delete readyToExport[j]["zip"];
      delete readyToExport[j]["gender"];
      delete readyToExport[j]["answers"];
      delete readyToExport[j]["isCompleted"];
      delete readyToExport[j]["patientType"];
      delete readyToExport[j]["pharmacyRefIndicator"];
      delete readyToExport[j]["isPrescribed"];
      delete readyToExport[j]["transactionDescription"];

      //Format required columns

      //Status
      readyToExport[j].status = this.getStatusDetails(readyToExport[j].status)[0].name;
      console.log(readyToExport[j].status);
      //ReturningPatient
      readyToExport[j].isReturningPatient = readyToExport[j].isReturningPatient ? "No" : "Yes";
      //DOB 
      let jsonPart: any = JSON.parse(readyToExport[j].profileDetails)[1].Answer;
      readyToExport[j].dob = jsonPart;
      //State
      readyToExport[j].state = JSON.parse(readyToExport[j].profileDetails)[0].Answer;

      delete readyToExport[j]["profileDetails"];
    }

    //var a = JSON.stringify(this.dataSource.data);
    //delete readyToExport["pharmacyId"];

    //readyToExport[0].keys = ["Id","First Name","Last Name","DOB","Phone","Covid","Submission Time","State","Assigned To","New Patient","Status"];

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(readyToExport)
    var header = Object.keys(readyToExport[0]); // columns name


    var wscols = [];
    for (var i = 0; i < header.length; i++) {  // columns length added
      wscols.push({ wch: header[i].length + 5 });
    }
    ws['!cols'] = wscols;


    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName, { bookType: 'xlsx', type: 'buffer' });
  }


  exportToExcelNew(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }


}
