import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SendEmailAdminComponent } from '../send-email-admin/send-email-admin.component';

@Component({
  selector: 'app-info-dialog-admin-doctor-preview',
  templateUrl: './info-dialog-admin-doctor-preview.component.html',
  styleUrls: ['./info-dialog-admin-doctor-preview.component.css']
})

export class InfoDialogActivateAccountComponent {
  constructor(public dialogRef: MatDialogRef<MatDialog>, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {
      name: string,
      email: string,
      doctorSpecialty: string,
      birthdate: string,
      workAddress: string,
      gender: string,
      phoneNumber: string
    }) { }
  closeDialog() {
    this.dialogRef.close();
  }
  sendEmailAdmin(email:string, name:string) {
    console.log(email);
    this.closeDialog();
    const dialogContent = this.dialog.open(SendEmailAdminComponent, {
      data: { email: email, name:name },
    });
  }
}
