import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()

export class DynamicServiceUrls {
    constructor(private _snackBar: MatSnackBar) { }
    currentWebURL = window.location.href;
    splitCurrentURL = this.currentWebURL.split("//");
    splitApplicationURL = this.splitCurrentURL[1].split("/");
    domainUrl  = this.splitCurrentURL[0] + "//" + this.splitApplicationURL[0] + "/" 
    rootDomain = this.splitApplicationURL[1] ; 
    blobUrl = "https://gracebeta.blob.core.windows.net/userfiles/Telemedicine/Esign/";
    //blobUrl = "https://gracesoft.blob.core.windows.net/userfiles/Telemedicine/Esign/";
    
    port = "https://frontlinemds.com/intakeformapi/"; // production
    // domainUrl  = 'https://gracebeta.com/';
    // rootDomain = 'PMSUI-SVN'; 
    //virtualUrl_PMSUI = this.domainUrl + this.rootDomain +"/"; //this.getSvnRootName(this.rootDomain);
 
    //Service calling url 
   // port = 'https://localhost:44316/'; 
    // port = 'https://localhost:5001/'; 
    //port = virtualUrl_PMSUI + "";
    //port = "http://localhost/PMS.WebAPI/";

    //port = 'https://meds.gracesoft.com/telemedicineapi/'
    //port = this.domainUrl + 'telemedicineapi/'; 
    //port = this.domainUrl + 'intakeformapi/'; 
    adminService = this.port + 'api/admin/';  
    userLoginService = `${ this.port }users/`;
    providerService = `${ this.port }Provider/`;
    pdfLink = this.domainUrl + 'intakeform/pdfs/intake-';//13.pdf' 

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
          duration: 2000,
        });
    } 
}





























