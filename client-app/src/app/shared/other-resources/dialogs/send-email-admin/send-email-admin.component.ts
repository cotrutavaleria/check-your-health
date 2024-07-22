import { Component, Inject, NgZone, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdministratorServices } from 'src/app/shared/services/administrator.service';

@Component({
  selector: 'app-send-email-admin',
  templateUrl: './send-email-admin.component.html',
  styleUrls: ['./send-email-admin.component.css']
})
export class SendEmailAdminComponent {
  constructor(public dialog: MatDialogRef<MatDialog>, private _ngZone: NgZone, private form: FormBuilder,private adminServices:AdministratorServices,
    @Inject(MAT_DIALOG_DATA) public data: {
    name: string,
    email: string,
    doctorSpecialty: string,
    birthdate: string,
    workAddress: string,
    gender: string,
    phoneNumber: string
  }) { }
  emailForm = this.form.group({
    message: ['', Validators.required],
  });
  closeDialog() {
    this.dialog.close();
  }
  @ViewChild('autosize')
  autosize!: CdkTextareaAutosize;
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }
  sendEmail(email: string, form:FormGroup) {
    this.adminServices.rejectThroughEmail(email, form.value.message);
  }

}




