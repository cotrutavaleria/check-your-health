import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.css']
})
export class HelpPageComponent implements OnInit{
  constructor(private form: FormBuilder, private responsive: BreakpointObserver, private authentication: UserService) { }
  helpForm!: FormGroup;
  cardWidth!:number;
  ngOnInit() {
    this.helpForm = this.form.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required]],
      reason: ['', [Validators.required,]],
    });
    this.resize();
  }
  onSubmit(form: FormGroup) {
    const contactUs = { emailAddress: form.value.emailAddress, fullName: form.value.fullName, reason: form.value.reason };
    this.authentication.sendContactUsMail(contactUs);
  }

  resize() {
    this.responsive.observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.Small]).subscribe(result => {
      this.cardWidth = 600;
      if (result.matches) {
        this.cardWidth = 300;
      }
    })
  }
}
