import { Address } from './address'
import { Injectable } from "@angular/core";

@Injectable()
export class ProfessionalReferences extends Address {
    public Id : number
    public CreatedDate: Date 
}
