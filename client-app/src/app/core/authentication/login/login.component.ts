import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private form: FormBuilder, private responsive: BreakpointObserver, private authentication:UserService, private router: Router) { }
  hide = true;
  hidePicture = false;
  loginForm!: FormGroup;
  
  ngOnInit() {
    this.loginForm = this.form.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/(?=.*[a-zA-Z@$!%*#?&^_-\d]).{8,}/)]],
    });
  }

  goToResetPassword(){
    this.router.navigateByUrl("/auth/reset-password");
  }

  onSubmit(form: FormGroup) {
    const user = { emailAddress: form.value.emailAddress, password: form.value.password };
    this.authentication.login(user, form);
  }
}
