import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AccessLavel } from '../../model/login-details';
import { AdminService } from '../../service/admin.service';
import { AthenticationService } from '../../service/athentication.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditPromocodeComponent } from './edit-promocode/edit-promocode.component';

@Component({
  selector: 'app-promocode',
  templateUrl: './promocode.component.html',
  styleUrls: ['./promocode.component.scss']
})
export class PromocodeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isAdminAccess: boolean = false;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['promocodeId','promocodeName','promocodePercent','promocodeIsActive', 'promocodeStartDate', 'promocodeEndDate', 'actions']

  constructor(public adminService: AdminService, private route: Router, 
    private athenticationService: AthenticationService, private dialog: MatDialog) { 
      if(this.athenticationService.currentUserValue==null) {
        this.route.navigate(['/login']);
      }
      else {
        let accessableMenues = JSON.parse(localStorage.getItem("accessableMenues"));
        if(accessableMenues) {
          if(accessableMenues.filter(f => f.code == 13).length <= 0) {
            this.route.navigate(['/login']);
          }
        }
        else {
          this.route.navigate(['/login']);
        }
      }
    }

  ngOnInit(): void {
    this.getPromocodeDetails();
  }

  getPromocodeDetails() {
    this.adminService.getPromocodeDetails().subscribe(data => {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.data = data;
      console.log(this.dataSource.data);
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
    }, error => {

    });
    //console.log(this.dataSource.data);
  }
  openEditForm(element) {
    let data = { element: element, promocodeList: this.dataSource.data }
    const dialogRef = this.dialog.open(EditPromocodeComponent, { data : data });
    dialogRef.afterClosed().subscribe(data => {
      this.getPromocodeDetails();
    });
   
  }

  deletePromo(element) {
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure want to delete the promocode?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const a = document.createElement('a');
        a.click();
        a.remove();
        this.adminService.deletePromocodeDetails(element.promocodeId).subscribe(response => {
          this.getPromocodeDetails();
        },
        error =>{
          console.log("error occurred duringthe operation")
        });
      }
    });
  }

  applyFilter(event: Event) {
    
    const symptomsFilter = (event.target as HTMLInputElement).value;
    this.dataSource.filter = symptomsFilter.trim().toLowerCase();
  }

}
