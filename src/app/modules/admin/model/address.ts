import { UserDetails } from './user-details'
import { Injectable } from "@angular/core";

@Injectable()
export class Address extends UserDetails {
    public FirstName: string
    public LastName: string
    public Initial: string
    public MailingAddress: string
    public City: string
    public State: string
    public ZipCode: string
    public County: string
    public PhoneNumber: string
    public MobileNumber: string
    public Email: string
}
