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

@Injectable()
export class ReportRequest {
    startDate: string
    endDate: string
    isAdmin: boolean
    userId : number
    submissionId : number
    isSingleSubmission: boolean = false;
    reportType : string
}

export class AuthProperties {
    IsVerifiedUser : boolean
    loginDetails: LoginDetails
}


