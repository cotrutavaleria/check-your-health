import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog-reset-password',
  templateUrl: './info-dialog-reset-password.component.html',
  styleUrls: ['./info-dialog-reset-password.component.css']
})

export class InfoDialogResetPasswordComponent {
  constructor( public dialog: MatDialogRef<MatDialog>) {}
  closeDialog() {
    this.dialog.close();
  }
}
