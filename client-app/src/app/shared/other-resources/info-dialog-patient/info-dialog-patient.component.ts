import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-dialog-patient',
  templateUrl: './info-dialog-patient.component.html',
  styleUrls: ['./info-dialog-patient.component.css']
})
export class InfoDialogPatientComponent {
  constructor( public dialog: MatDialogRef<MatDialog>, private router:Router) {}
    closeDialog() {
      this.dialog.close();
      this.router.navigateByUrl('/home');
    }
}
