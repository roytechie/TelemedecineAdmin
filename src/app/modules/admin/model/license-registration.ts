import { UserDetails } from './user-details'
import { Injectable } from "@angular/core";

@Injectable()
export class LicenseRegistration extends UserDetails {
    public Id: number
    public LicenseState: string
    public LicenseType: string
    public LicenseNumber: string
    public LicenseExpirationDate: string
    public IsActiveLicense: boolean
    public CreatedDate: Date
    public Mode : string
    set(id: number, isActiveLicense: boolean)
    {
        this.Id = id;
        this.LicenseState = "";
        this.LicenseType = "";
        this.LicenseNumber = "";
        this.LicenseExpirationDate = "";
        this.IsActiveLicense = isActiveLicense;
        this.CreatedDate = new Date();
        this.Mode  = 'Add';
    }
}
