import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  constructor(private form: FormBuilder, private responsive: BreakpointObserver, private authentication: UserService) { }
  resetPasswordForm!: FormGroup;

  ngOnInit() {

    this.resetPasswordForm = this.form.group({
      emailAddress: ['', [Validators.required, Validators.email]],
    });
  }
  onSubmit(form: FormGroup) {
    this.authentication.resetPasswordSendEmail(form.value.emailAddress, form);
  }
}
