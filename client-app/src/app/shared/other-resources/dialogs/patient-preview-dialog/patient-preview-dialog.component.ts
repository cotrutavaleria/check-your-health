import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppointmentService } from 'src/app/shared/services/appointment.service';


export interface PatientDetails{
  name: string;
  email: string;
  phoneNumber: string;
  birthdate: string;
  gender: string;
  image:string;
}

@Component({
  selector: 'app-patient-preview-dialog',
  templateUrl: './patient-preview-dialog.component.html',
  styleUrls: ['./patient-preview-dialog.component.css'],
  styles: [`
  :host {
    display: block;
    background: #89a5e8;
    padding: 16px;
  }
`]
})
export class InfoDialogPatientPreviewComponent {
  notFound!:boolean;
  patientDetails!:PatientDetails;
  dialogHeight!:number;
  dialogWidth!:number;
  constructor(private appointmentService: AppointmentService, private screenSize: BreakpointObserver,public dialogRef: MatDialogRef<MatDialog>, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {
      patientUuid: string,
    }) {
      this.initPatientDetails(); 
      this.getPatientInformation();
      this.resize();
    }
  closeDialog() {
    this.dialogRef.close();
  }

  initPatientDetails(){
    this.patientDetails = {
      name: '',
      email: '',
      birthdate: '', 
      phoneNumber: '',
      gender: '',
      image:"./assets/profile/blank-profile-picture.png"
    }
  }

  getPatientInformation(){
    this.appointmentService.getPatientInformation(this.data.patientUuid).subscribe(result => {
      if(result != null){
        this.patientDetails = {
          name: result.fullName,
          email: result.emailAddress,
          birthdate: result.birthdate,
          phoneNumber: result.phoneNumber,
          gender: result.gender,
          image: result.image != '' ? result.image : "./assets/profile/blank-profile-picture.png"
        }
      }
      console.log(this.patientDetails.image);
    },
    (error:any)=>{
      this.notFound = true;
    }
    );
  }
  resize() {
    this.screenSize.observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.Small]).subscribe(result => {
      this.dialogHeight = 400;
      this.dialogWidth = 400;
      if (result.matches) {
        this.dialogHeight = 450;
        this.dialogWidth = 250;
      }
    })
  }

}
