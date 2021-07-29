import { Injectable } from "@angular/core" 
import { LoginDetails } from './login-details'

@Injectable()
export class PatiantInformation
{
    SubmissionId: number
    SubmissionTime: Date
    Status: number
    FirstName: string
    LastName: string
    Email: string
    Phone: string
    PaymentTime: Date
    AuthTranId: number
    Notes: string
    IsCovid : boolean
    LoginDetails: LoginDetails
    Activities: string
    ActivitiesDetails: string
    FollowupNotes: string
    UserId: number
    IsAssigneeChanged: boolean = false;
    DoctorName : string;
    IsReturningPatient : boolean
    IsPrescribed: boolean
    IsCompleted: boolean

    set(data: any) 
    {
        this.SubmissionId = data.submissionId;
        this.Status = data.status;
        this.Notes = data.notes;
        this.FollowupNotes = data.followupNotes; 
        this.FirstName = data.firstName;
        this.LastName = data.lastName;  
        this.UserId = data.loginDetails.userId;
        this.DoctorName = data.doctorName;
    }
} 
