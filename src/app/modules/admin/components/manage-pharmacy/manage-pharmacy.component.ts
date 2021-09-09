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
import { EditPharmacyComponent } from './edit-pharmacy/edit-pharmacy.component';

@Component({
  selector: 'app-manage-pharmacy',
  templateUrl: './manage-pharmacy.component.html',
  styleUrls: ['./manage-pharmacy.component.scss']
})
export class ManagePharmacyComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isAdminAccess: boolean = false;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['pharmacySequenceId', 'pharmacyName', 'loginUserName', 
  'pharmacyContactNum', 'pharmacyEmailAddress', 'pharmacyAddress', 'pharmacyCity', 'pharmacyState', 
  'pharmacyFax', 'pharmacyZipCode', 'pharmacyCountry', 'actions']

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
    this.getPharmacyLoginDetails();
  }

  getPharmacyLoginDetails() {
    this.adminService.getPharmacyUserLoginDetails().subscribe(data => {
      this.dataSource = new MatTableDataSource<any>(data);
      this.dataSource.data = data;
      setTimeout(() => this.dataSource.paginator = this.paginator);
      setTimeout(() => this.dataSource.sort = this.sort);
    }, error => {

    });
  }
  openEditForm(element) {
    let data = { element: element, pharmacyList: this.dataSource.data }
    const dialogRef = this.dialog.open(EditPharmacyComponent, { data : data });
    dialogRef.afterClosed().subscribe(data => {
      this.getPharmacyLoginDetails();
    });
  }

  deletePharmacy(element) {
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure want to delete the pharmacy?',
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
        this.adminService.deletePharmacyLoginDetails(element.pharmacySequenceId).subscribe(response => {
          this.getPharmacyLoginDetails();
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
