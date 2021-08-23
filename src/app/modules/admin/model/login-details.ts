import { Injectable } from '@angular/core'

@Injectable()
export class LoginDetails {
    FirstName: string
    LastName: string
    UserName: string
    Password: string
    Email: string
    UserId: number
    isActiveUser: boolean
    AdminUserId: number
    AdminUserName: string
    PhoneNumber: string
}

export enum AccessLavel {
    Admin = 1,
    Pharmacy = 9,
    Other = 10
}

@Injectable()
export class ReportRequest {
    startDate: string
    endDate: string
    isAdmin: boolean
    userId : number
    submissionId : number
    isSingleSubmission: boolean = false;
    reportType: string
    symptomFilter:string
}

export class AuthProperties {
    IsVerifiedUser : boolean
    loginDetails: LoginDetails
}


