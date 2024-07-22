import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-dialog-doctor',
  templateUrl: './info-dialog-doctor.component.html',
  styleUrls: ['./info-dialog-doctor.component.css']
})
export class InfoDialogDoctorComponent {
  constructor(public dialog: MatDialogRef<InfoDialogDoctorComponent>,
    @Inject(MAT_DIALOG_DATA)
    private _data: {
      email: string;
    },public router:Router ) {}
  closeDialog() {
    this.dialog.close();
    this.router.navigateByUrl('/home');

  }
}
