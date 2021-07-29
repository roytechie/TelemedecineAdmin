import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../service/admin.service';
import { AthenticationService } from '../../service/athentication.service';
import { ReportRequest } from './../../model/login-details'

@Component({
  selector: 'app-activity-logs',
  templateUrl: './activity-logs.component.html',
  styleUrls: ['./activity-logs.component.scss']
})
export class ActivityLogsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['date', 'time', 'userName', 'activity', 'details'];
  dataSource: any = [];
  usersList: any = [];
  isActiveUser: boolean = false; 
  isLoading: boolean = false;

  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(private adminService: AdminService,
    private reportRequest: ReportRequest) { }

  ngOnInit() {
    //this.getHistoryDetails();
  }

  getHistoryDetails(isTodayList : boolean) 
  {   
    if(isTodayList)
    {
      this.startDate = new Date(); 
      this.endDate = new Date(); 
    } 
 
    this.isLoading = true;
    this.reportRequest.startDate = this.adminService.returnFormatedDate(this.startDate);
    this.reportRequest.endDate = this.adminService.returnFormatedDate(this.endDate);  
    this.reportRequest.isAdmin = JSON.parse(localStorage.currentUser).isAdmin;
    this.reportRequest.userId = JSON.parse(localStorage.currentUser).id;
    this.adminService.GetActivityLogs(this.reportRequest).subscribe(response=>{
    this.usersList = response;
    
    this.dataSource = new MatTableDataSource<any>(this.usersList); 
    setTimeout(() => this.dataSource.paginator = this.paginator);
    setTimeout(() => this.dataSource.sort = this.sort); 
    this.isLoading = false;
    }); 
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
