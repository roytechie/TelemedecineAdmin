import { Injectable } from "@angular/core";
@Injectable()
export class UserDetails {
    public UserId: number
    public Mode: string
}

@Injectable()
export class FileToUpload {
    fileName: string = "";
    fileSize: number = 0;
    fileType: string = "";
    lastModifiedTime: number = 0;
    lastModifiedDate: Date = null;
    fileAsBase64: string = "";
}
