import { Injectable } from '@angular/core'

export interface EmailProperties {
    
    FromAddress?: string;
    ToAddress?: string;
    CC?: string;
    Subject?: string;
    EmailBody?: string;
        
}