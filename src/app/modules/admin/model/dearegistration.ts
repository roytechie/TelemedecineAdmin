import { UserDetails } from './user-details'
import { Injectable } from "@angular/core";

@Injectable()
export class DEARegistration extends UserDetails {
    public Id: number
    public DeaRegistrationNumber: string
    public ExpirationDate: Date
    public CreatedDate: Date
    public Mode: string

    public registrationStatus = [
        { name: 'Dea',  selected: false, id: 1 },
        { name: 'No-dea',  selected: false, id: 2 },
        { name: 'Govt-dea',  selected: false, id: 3 },
        { name: 'DEA-pending',  selected: false, id: 4 },
    ];

    set(id : number)
    {
        this.Id = id;
        this.DeaRegistrationNumber = "";
        this.ExpirationDate = null;
        this.CreatedDate = new Date()
        this.Mode = "Add"
    }   

    public StatusText = [
        { text : 'I have a DEA and will forward you my number. (*Note, I must have a Social Security Number and a valid DEA number in order to verify the DEA.)'},
        { text : 'I don’t hold a DEA & I have no plans to apply for one'},
        { text : 'I hold a Government/Fee waived DEA '},
        { text : 'My DEA is Pending'}
    ] 
}
