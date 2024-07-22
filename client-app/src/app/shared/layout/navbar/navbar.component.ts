import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Route, Router, RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe, NgIf, NgFor, NgStyle } from "@angular/common";
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { Functionalities } from 'src/app/shared/responses/functionalities';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SearchComponent } from '../../../shared/other-functionalities/search/search.component';
import { HttpClient } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { JWTService } from 'src/app/shared/services/jwt.service';
import { UserService } from 'src/app/shared/services/user.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [TranslateModule, RouterLink, RouterLinkActive, AsyncPipe, NgIf, NgFor, NgStyle, MatToolbarModule, MatButtonModule, MatIconModule, CdkMenuTrigger, CdkMenu, CdkMenuItem, MatMenuModule],
  standalone: true
})
export class NavbarComponent implements OnInit {
  hideHorizontalNavbar = false;
  moveSearchButton = true;
  flexSize = 1;
  navbarList!: Array<Functionalities>;
  tokenInfo!: string;
  isAuthenticated: boolean = false;
  userFullName!: string;
  isPatient!: boolean;
  isAdmin!: boolean;
  user!: any;
  constructor(private translate: TranslateService, private cd: ChangeDetectorRef, private screenSize: BreakpointObserver, public dialog: MatDialog, private userService: UserService, private jwtService: JWTService, private http: HttpClient, private router: Router) {
    this.navbarList = [
      {
        type: 'Log in',
        link: 'auth/login',
        icon: ''
      },
      {
        type: 'Sign up',
        link: 'auth/signup',
        icon: ''
      }
    ];
  }

  ngOnInit(): void {
    this.resizeScreen();
    this.userService.loginSuccess.subscribe(() => {
      this.userService.getUserInfo().subscribe((userInfo) => {
        this.user = userInfo;
        this.cd.detectChanges();
        console.log('Navbar updated with user info:', this.user);
      });

      const token = this.userService.getToken();
      if (token) {
        this.userService.updateNavbar(token).subscribe(userInfo => {
          this.user = userInfo;
          this.cd.detectChanges();
          console.log('Navbar updated on init with token info');
          if (this.user && this.user.userType) {
            if (this.user.userType === 'A') {
              this.isAdmin = true;
            } else if (this.user.userType === 'P') {
              this.isAdmin = false;
              this.isPatient = true;
            } else if (this.user.userType === 'D') {
              this.isAdmin = false;
              this.isPatient = false;
            }
            this.isAuthenticated = this.user.isAuthenticated;
            this.userFullName = this.user.userFullName;
          }
        });
      }
    })
  }

  ngAfterViewInit() {
    this.userService.getUserInfo().subscribe((userInfo) => {
      this.user = userInfo;
      console.log('Navbar updated with user info:', this.user);
    });

    const token = this.userService.getToken();
    if (token) {
      this.userService.updateNavbar(token).subscribe(userInfo => {
        this.user = userInfo;
        console.log('Navbar updated on init with token info');
        if (this.user && this.user.userType) {
          if (this.user.userType === 'A') {
            this.isAdmin = true;
            console.log('User is an administrator');
          } else if (this.user.userType === 'P') {
            this.isAdmin = false;
            this.isPatient = true;
            console.log('User is an patient');
          } else if (this.user.userType === 'D') {
            this.isAdmin = false;
            this.isPatient = false;
            console.log('User is an doctor');
          }
          this.isAuthenticated = this.user.isAuthenticated;
          this.userFullName = this.user.userFullName;
        }
      });
    } else {
      this.isAdmin = false;
      this.isPatient = false;
      this.isAuthenticated = false;
      this.userFullName = "";
    }
  }

  resizeScreen() {
    this.screenSize.observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Small]).subscribe(result => {
      if (result.matches) {
        this.moveSearchButton = true;
        this.hideHorizontalNavbar = true;
      } else {
        this.moveSearchButton = false;
        this.hideHorizontalNavbar = false;
      }
    });
  }

  searchDoctorSpecialty() {
    const dialogContent = this.dialog.open(SearchComponent);
  }

  logout() {
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.userFullName = "";
    this.userService.logout();
  }

  changeLanguage(language: string) {
    let url = window.location.href;
    let urlSplit = url.split("/");
    this.translate.use(language);
    localStorage.setItem("language", language);
    console.log(url)
    if (urlSplit.includes("other-settings") || urlSplit.includes("home") || urlSplit.includes("doctor") || urlSplit.includes("signup")  || url.includes("search")) {
      window.location.reload();
    }
  }

}
