import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { LoginDetails } from '../../model/login-details';
import { PatiantInformation} from '../../model/PatiantInformation';
import { AdminService } from '../../service/admin.service';
import { AthenticationService } from '../../service/athentication.service';
import { DoctorsFormComponent } from '../doctors-form/doctors-form.component';
import { ListSubmissionsComponent } from '../list-submissions/list-submissions.component';

@Component({
  selector: 'app-view-submission',
  templateUrl: './view-submission.component.html',
  styleUrls: ['./view-submission.component.scss']
})
export class ViewSubmissionComponent implements OnInit { 

  patientsList: any 
  submissionId: number;
  answers : any;
  options: any = []; 
  userList: any =[];
  isAdmin: boolean = false;
  userId: number = 0;
  pharmacySpecificData : any
  closeButtonText = 'Cancel';
  operationVisibility = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data:any, 
  public adminService: AdminService, private dialog : MatDialog,
  public patiantInformation: PatiantInformation,
  private athenticationService: AthenticationService,
  private loginDetails: LoginDetails) 
  { 
    this.patiantInformation.set(this.data.response); 
    
    if (this.athenticationService.currentUserValue) { 
      //this.route.navigate(['user/submissions-list']);
      //console.log(this.athenticationService.currentUserValue);
      this.loginDetails.UserName = this.athenticationService.currentUserValue.username;
      this.loginDetails.UserId = this.athenticationService.currentUserValue.id;
      this.isAdmin = this.athenticationService.currentUserValue.isAdmin;
    } 

  }

  ngOnInit() {  
      //this.options = this.stausOptions.options; 
      this.checkVisibility(this.data.modalViewType);
      this.adminService.getAnswers(this.data.response).subscribe(response => {
        //this.answers = response; 
        this.answers = response.surveySteps;

        // response.surveySteps.forEach(element => {
        //   console.log(element);
        // });
      }); 

      this.getPharmacyReportSpecific();
      
      //console.log("Pharmacy Specific Data : " + this.pharmacySpecificData);

      this.getUsersList();
  } 

  updatePatiantDetails() 
  {
    let isStatusChanged = this.patiantInformation.Status != this.data.response.status;
    let isNotesUpdated = this.patiantInformation.Notes != this.data.response.notes;
    let isDoctorChanged = this.patiantInformation.UserId != this.data.response.loginDetails.userId
    let isFollowupNotesUpdated = this.patiantInformation.FollowupNotes != this.data.response.followupNotes

    let statusInfo: any = [];
    let activityInfo: any = [];

    this.patiantInformation.Activities = '';
    this.patiantInformation.ActivitiesDetails = '';

    if(isStatusChanged) {
      statusInfo.push('Status');

      let status = this.patiantInformation.Status;
      let objStatus = this.adminService.patientStatuses.filter(obj=>{ 
        return obj.value == status;
      })

      activityInfo.push("Status updated - " + objStatus[0].name);

      this.patiantInformation.IsPrescribed = this.patiantInformation.Status == 3 && 
      this.patiantInformation.Status != this.data.response.status;

      this.patiantInformation.IsCompleted = this.patiantInformation.Status == 7 && 
      this.patiantInformation.Status != this.data.response.status; 
    }
    else 
    {
      this.patiantInformation.IsPrescribed = false; 
      this.patiantInformation.IsCompleted = false;;
    }

    if(isNotesUpdated){
      statusInfo.push('Notes'); 

      activityInfo.push("Notes updated - " + this.patiantInformation.Notes);
    }

    if(isDoctorChanged && this.patiantInformation.UserId !=0 ) 
    { 
      statusInfo.push('User assigned');  
      let userId = this.patiantInformation.UserId;
      var objUser = this.userList.filter(obj=>{
        return obj.userId == userId
      });
      activityInfo.push("User assigned updated - " + objUser[0].userName); 
      this.patiantInformation.IsAssigneeChanged = true;
      this.patiantInformation.LoginDetails = objUser[0];
      this.patiantInformation.LoginDetails.AdminUserId = this.athenticationService.currentUserValue.id;
      this.patiantInformation.LoginDetails.AdminUserName = this.athenticationService.currentUserValue.username
    }
    else
    {
      if(this.patiantInformation.UserId==0){
        statusInfo.push("User unassigned"); 
      }
      this.patiantInformation.IsAssigneeChanged = false;
      this.patiantInformation.LoginDetails = this.loginDetails;
      this.patiantInformation.LoginDetails.AdminUserId = this.athenticationService.currentUserValue.id;
      this.patiantInformation.LoginDetails.AdminUserName = this.athenticationService.currentUserValue.username
    }

    if(isFollowupNotesUpdated){
      statusInfo.push('Follow up notes');  
      activityInfo.push("Follow up notes updated - " +this.patiantInformation.FollowupNotes);
    }

    statusInfo.forEach(obj=>{
      this.patiantInformation.Activities = this.patiantInformation.Activities + ", " + obj;
    });

    activityInfo.forEach(obj=>{
      this.patiantInformation.ActivitiesDetails = this.patiantInformation.ActivitiesDetails + ", " + obj;
    });

    if(this.patiantInformation.Activities.length > 0){ 
      this.patiantInformation.Activities =  this.patiantInformation.Activities.slice(1) + " updated. "
    }

    if(this.patiantInformation.ActivitiesDetails.length > 0){ 
      this.patiantInformation.ActivitiesDetails =  this.patiantInformation.ActivitiesDetails.slice(1);
    }


    // if(isStatusChanged && isNotesUpdated){
    //   this.patiantInformation.Activities = "Status changed and Notes updated";
    // }
    // else if(isStatusChanged){
    //   this.patiantInformation.Activities = "Status changed";
    // }
    // else if(isNotesUpdated)
    // {
    //   this.patiantInformation.Activities = "Notes updated";
    // }
    
    let isFormModified = isStatusChanged || isNotesUpdated || 
    isDoctorChanged || isFollowupNotesUpdated;

    //let detailsLogin = new LoginDetails();
    if(isFormModified){
      //detailsLogin.UserId = this.patiantInformation.UserId;
      
      //this.patiantInformation.LoginDetails = detailsLogin;
      this.patiantInformation.Activities = this.patiantInformation.Activities +
      " : SubmissionId: "+ this.patiantInformation.SubmissionId;
      
      //this.patiantInformation.LoginDetails = this.loginDetails;

      this.patiantInformation.FollowupNotes = this.patiantInformation.FollowupNotes == null ? '' :
      this.patiantInformation.FollowupNotes;

      this.patiantInformation.Notes = this.patiantInformation.Notes == null ? '' :
      this.patiantInformation.Notes;

      this.adminService.updatePatiantDetails(this.patiantInformation).subscribe(response=>{
        if(response > 0){ 
        }
      });
    } 
  } 
  
  showPrescriptionPopup(status : number) { 
    console.log(this.data.response);
    if(status == 3) { 
      this.dialog.open( DoctorsFormComponent, { data : this.data.response})
    }  
  }

  assignDoctors(doctorName: string) {
    if(doctorName != 'Not Assigned') {
      this.patiantInformation.DoctorName = doctorName.toUpperCase();
    }
    else
    {
      this.patiantInformation.DoctorName = doctorName;
    } 
  }

  getUsersList() 
  { 
    let sortingOrder ='userName';
    this.adminService.getUserDetails(sortingOrder).subscribe(response=>{
      //this.userList = response; 
      console.log(response);
      this.userList = response.filter(obj=>{
        return (obj.isActiveUser && obj.accessLevel == 2);
      });
    }); 
  } 

  getPharmacyReportSpecific(){
    if(this.data.modalViewType== "viewSubmission") {
      this.adminService.getPharmacyReportSpecific(this.data.response).subscribe(response => {
        //this.answers = response; 
  
        this.pharmacySpecificData = response;
  
        console.log (response);
  
      });
    }
    else {
      this.data.response.submissionId = this.data.tableParameterId;
      console.log(this.data.response);
      this.adminService.getPharmacyReportSpecific(this.data.response).subscribe(response => {
        //this.answers = response; 
  
        this.pharmacySpecificData = response;
  
        console.log (response);
  
      });
    }
     
  }

  checkVisibility(viewType: string): void {
    if(viewType == 'viewSubmission') {
      this.operationVisibility = true;
    }
    else {
      this.closeButtonText = 'Close';
      this.operationVisibility = false;
    }
  }

}
