import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { JWTService } from 'src/app/shared/services/jwt.service';
@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css'],
})
export class ProfileSettingsComponent implements OnInit {
  alignItemsMode!: string;
  flexDirectionMode!: string;
  flexDirectionModeLeftCard!: string;
  widthSize!: number;
  leftCardWidth!: number;
  marginLeftSize!: number;
  token!: string;
  isDoctor!: boolean;
  fileName = '';
  profileImage = './assets/profile/blank-profile-picture.png';
  updateProfileInformation = this.form.group({
    fullName: '',
    gender: '',
    birthdate: new FormControl<Date | null>(null),
    email: '',
    phoneNumber: '',
  });
  gender:string = "";
  birthdate!:string;
  constructor(private form: FormBuilder, private screenSize: BreakpointObserver, private userService: UserService, private jwtService: JWTService, private http: HttpClient, private router: Router) { }
  ngOnInit(): void {
    this.screenSize.observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.Small]).subscribe(searchResponse => {
      this.alignItemsMode = 'flex-start';
      this.flexDirectionMode = 'row';
      this.flexDirectionModeLeftCard = 'column';
      this.widthSize = 55;
      this.leftCardWidth = 30;
      this.marginLeftSize = 100;
      if (searchResponse.matches) {
        this.alignItemsMode = 'center';
        this.flexDirectionMode = 'column';
        this.flexDirectionModeLeftCard = 'column';
        this.leftCardWidth = 60;
        this.widthSize = 80;
        this.marginLeftSize = 0;
      }
    })
    this.token = this.jwtService.getJWT();
    this.userService.getUserInformation(this.token).subscribe(
      (result: any) => {
        if (result != null) {
          if (result.userType === "DOCTOR") {
            this.isDoctor = true;
          } else {
            this.isDoctor = false;
          }
          if (result.image != null && result.image != "") {
            this.profileImage = result.image;
          }
          this.updateProfileInformation = this.form.group({
            fullName: [result.fullName, [Validators.required, Validators.minLength(4)]],
            gender: new FormControl({value: result.gender, disabled: true}, Validators.required),
            birthdate: new FormControl({value: result.birthdate, disabled: true}, Validators.required),
            email: [result.emailAddress, [Validators.required, Validators.email]],
            phoneNumber: [result.phoneNumber, [Validators.required, Validators.pattern(/^\d{10}$/)]],
          });
          this.gender = result.gender;
          this.birthdate = result.birthdate;
        }
        
      }), (error: any) => {
        if (error.status == 401 || error.status == 500) {
          this.userService.logout();
        }
      };
  }

  onSubmit(form: FormGroup) {
    this.token = this.jwtService.getJWT();
    const data = {
      fullName: form.value.fullName,
      emailAddress: form.value.email,
      birthdate: this.birthdate,
      gender: this.gender,
      phoneNumber: form.value.phoneNumber,
    };
    console.log(data);
    if (this.isDoctor) {
      this.userService.updateDoctorInformation(data, this.token, form);
    } else {
      this.userService.updatePatientInformation(data, this.token, form);
    }
  }

  logout() {
    this.jwtService.destroyJWT();
    setTimeout(() => {
      window.location.reload();
    }, 10);
    this.router.navigateByUrl('/auth/login');
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      this.token = this.jwtService.getJWT();
      formData.append("file", file);
      formData.append("token", this.token);
      this.http.post<any>('http://localhost:8081/api/v1/images', formData, {
        headers: {
          "X-AUTH-TOKEN": this.token
        }
      }).subscribe(
        (result: any) => {
          if (result != null && result.imageUrl != null) {
            this.profileImage = result.imageUrl;
          }
        },
        (error) => {
          if (error.status == 404) {
          } else if (error.status === 500) {
          }
        }
      );
    }
  }
} 
