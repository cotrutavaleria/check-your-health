import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-reset-password-email-accepted',
  templateUrl: './reset-password-email-accepted.component.html',
  styleUrls: ['./reset-password-email-accepted.component.css']
})
export class ResetPasswordEmailAcceptedComponent {
  resetPasswordForm!: FormGroup;
  constructor(private form: FormBuilder, private responsive: BreakpointObserver, private authentication: UserService, private router: Router,) { }
  ngOnInit(): void {
    this.resetPasswordForm = this.form.group({
      password: ['', [Validators.required, Validators.pattern(/(?=.*[a-zA-Z@$!%*#?&^_-\d]).{8,}/)]],
    });
  
  }
  onSubmit(form: FormGroup) {
    let url = this.router.url.split("/");
    const user = { token: url[3], password: form.value.password };
    this.authentication.resetPasswordAccepted(user, form);
  }
}
