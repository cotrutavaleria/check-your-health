import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-dialog-patient-account-activated',
  templateUrl: './info-dialog-patient-account-activated.component.html',
  styleUrls: ['./info-dialog-patient-account-activated.component.css']
})
export class InfoDialogPatientAccountActivatedComponent {
  constructor(public dialog: MatDialogRef<InfoDialogPatientAccountActivatedComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      message: string;
    },public router:Router ) {}
  closeDialog() {
    this.dialog.close();
    this.router.navigateByUrl('/home');
  }
}
