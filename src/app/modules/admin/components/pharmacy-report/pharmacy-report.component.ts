import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-pharmacy-report',
  templateUrl: './pharmacy-report.component.html',
  styleUrls: ['./pharmacy-report.component.scss']
})
export class PharmacyReportComponent implements OnInit {
  dataSource?: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['name', 'birthDate', 'phoneNo', 'weight', 'email'];
  endDate: Date = new Date();
  startDate: Date = new Date(new Date().getFullYear(), (new Date().getMonth() -1), new Date().getDate());
  showNoRecordsDiv: boolean = true;
  rowsAdded: boolean = false;
  disabledButton : boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(public adminService: AdminService) { }

  ngOnInit(): void {
    
  }

  getPharmacyReport() {
    let searchModel = {
      startDate: this.startDate,
      endDate: this.endDate
    }
    this.disabledButton = true;
    this.adminService.getPharmacyReport(searchModel).subscribe(response => {
      console.log(response);
      this.dataSource = new MatTableDataSource<any>(response);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
      this.disabledButton = false;
      if(this.dataSource.data.length > 0){
        this.rowsAdded = true;
        this.showNoRecordsDiv = false;
      }
    });
  }

  applyFilter(event: Event) {
    const symptomsFilter = (event.target as HTMLInputElement).value;
    this.dataSource.filter = symptomsFilter.trim().toLowerCase();
  }

}
