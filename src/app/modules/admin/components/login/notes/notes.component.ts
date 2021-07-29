import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { PatiantInformation } from '../../../model/PatiantInformation'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  constructor(private adminService: AdminService,
    public patieantDetails: PatiantInformation,
    private route: Router) { }

  ngOnInit() {
  }

  updateNotes(){
    // this.adminService.updatePatiantDetails(this.patieantDetails).subscribe(response=>{
    //   if(response > 0){
    //     this.route.navigate(['user/submissions-list']);
    //   }
    // });
  }
}
