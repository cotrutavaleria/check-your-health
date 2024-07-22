import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf, NgFor } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { map } from 'rxjs';
import { InfoDialogActivateAccountComponent } from '../../../../shared/other-resources/dialogs/info-dialog-admin-doctor-preview/info-dialog-admin-doctor-preview.component';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdministratorServices } from 'src/app/shared/services/administrator.service';

export interface TableInformation {
  name: string;
  id: number;
  doctorSpecialty: string;
  email: string;
  birthdate: string;
  gender: string;
  phoneNumber: string;
  workAddress: string;
}

@Component({
  selector: 'app-homepage-administrator',
  templateUrl: './homepage-administrator.component.html',
  styleUrls: ['./homepage-administrator.component.css']
})


export class HomepageAdministratorComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'doctorSpecialty', 'action'];
  dataSource!: any;
  row: TableInformation[] = [];
  doctors!: any;
  constructor(private adminServices: AdministratorServices, private httpClient: HttpClient, private dialog: MatDialog) { }
  ngOnInit(): void {
    this.httpClient.get('http://localhost:8081/api/v1/doctor-applications')
      .subscribe(result => {
        this.doctors = result;
        let position = 1;
        this.doctors.forEach((element: any) => {
          this.row.push({
            id: position,
            name: element.fullName,
            email: element.emailAddress,
            doctorSpecialty: element.specialty,
            birthdate: element.birthdate,
            workAddress: element.workAddress,
            gender: element.gender,
            phoneNumber: element.phoneNumber,
          });
          position++;
        });
        this.dataSource = new MatTableDataSource(this.row);
        console.log(this.dataSource);
      });
  }
  acceptDoctorRequest(element: any) {
    this.adminServices.acceptDoctorRequest(element);
  }
  rejectDoctorRequest(element: any) {
    this.adminServices.rejectDoctorRequest(element);
  }
  viewDoctorRequest(element: any) {
    console.log(element.email);
    const dialogContent = this.dialog.open(InfoDialogActivateAccountComponent, {
      data: {
        name: element.name, email: element.email,
        doctorSpecialty: element.doctorSpecialty,
        birthdate: element.birthdate,
        workAddress: element.workAddress,
        gender: element.gender,
        phoneNumber: element.phoneNumber,
      },
    });
  }

}



