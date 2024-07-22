import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit {
  constructor(private authentication: UserService, private router: Router,) { }
  ngOnInit(): void {
    let url = this.router.url.split("/");
    this.authentication.activateToken(url[3]);
  }
}

