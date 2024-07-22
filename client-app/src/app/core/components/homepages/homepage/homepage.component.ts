import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { SearchBarAutocomplete } from 'src/app/shared/other-functionalities/search-bar-autocomplete';
import { JWTService } from 'src/app/shared/services/jwt.service';
import { UserService } from 'src/app/shared/services/user.service';
import { SearchService } from 'src/app/shared/services/search.service';
import { NewsService } from 'src/app/shared/services/news.service';
import { AddressInputResponse, GoogleAdressesInputComponent } from '../../../../shared/other-functionalities/google-adresses-input/google-adresses-input.component';

export interface Article {
  title: string;
  url: string;
  image: string;
  description: string[50];
}
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  fontSize = 30;
  imageDoctorWidth = 40;
  gridListSize = 2;
  moveSearchButton = false;
  tokenInfo!: string;
  userType!: number;
  searchForm!: FormGroup;
  data!: any;
  articles: Article[] = [];
  placeholderText!:string;
  specialties: string[] = [];
  filteredOptions!: Observable<string[]>;
  quoteCardWidth!: number;
  workAddress: string = "";
  addressInput: AddressInputResponse = { address: '' };
  sourcePage = 'homepage';
  backgroundImage: string = '';
  constructor(private screenSize: BreakpointObserver, private jwtService: JWTService, private http: HttpClient, private userService: UserService,
    private form: FormBuilder, private router: Router, private searchService: SearchService, private newsService: NewsService, private searchBarAutocomplete: SearchBarAutocomplete) { }

  ngOnInit() {
    if(localStorage.getItem("language") == "ro"){
      this.placeholderText = "Locaţia...";
    }else{
      this.placeholderText = "Your location...";
    }
    this.resize();
    this.tokenInfo = this.jwtService.getJWT();
    this.getUserType();
    this.buildSearchForm();
    this.filteredOptions = this.searchBarAutocomplete.filterOptions(this.searchForm, 'specialtyOrDoctorName');
    this.getArticles();
  }

  getUserType() {
    this.userType = 3;
    this.backgroundImage = "url(./../../../../assets/homepage/homepage_default_image.png)";
    if (this.tokenInfo) {
      this.userService.getUserInformation(this.tokenInfo).subscribe(
        (result: any) => {
          if (result != null) {
            console.log(result)
            switch (result.userType) {
              case "PATIENT": {
                this.userType = 0;
                this.backgroundImage = "url(./../../../../assets/homepage/patient_homepage_image.png)";
                break;
              }
              case "DOCTOR": {
                this.userType = 1;
                this.backgroundImage = "url(./../../../../assets/homepage/doctor_homepage_image.png)";
                break;
              }
              case "ADMINISTRATOR": this.userType = 2; break;
              default: this.userType = 3; break;
            }
          }
        },
        (error: any) => {
          if (error.status == 401 || error.status == 500) {
            this.userService.logout();

          }
        });
    }
  }

  buildSearchForm() {
    this.searchForm = this.form.group({
      specialtyOrDoctorName: ['', [Validators.required]],
      location: ['', [Validators.required]]
    });
  }

  onSubmit(form: FormGroup) {
    if (this.addressInput.address != "") {
      form.get('location').patchValue(this.addressInput.address);
    } else {
      form.get('location').patchValue(this.workAddress);
    }
    let doctorsNames = this.searchBarAutocomplete.readAllDoctorsNames();
    let doctorsSpecialties = this.searchBarAutocomplete.readAllSpecialties();
    if (doctorsNames.includes(form.value.specialtyOrDoctorName)) {
      this.router.navigate(['/search'], {
        queryParams: { specialty: '', name: form.value.specialtyOrDoctorName, location: form.value.location }
      });
    } else if (doctorsSpecialties.includes(form.value.specialtyOrDoctorName)) {
      this.router.navigate(['/search'], {
        queryParams: { specialty: form.value.specialtyOrDoctorName, name: '', location: form.value.location }
      });
    } else {
      this.router.navigate(['/search'], {
        queryParams: { keyword: form.value.specialtyOrDoctorName, location: form.value.location }
      });
    }
  }

  onInput(value: string) {
    this.workAddress = value;
    console.log(this.workAddress)
  }


  getArticles() {
    console.log(this.userType);
    if (this.userType != 2) {
      this.newsService.getArticles(this.tokenInfo == undefined ? "" : this.tokenInfo, localStorage.getItem("language")).subscribe(
        (result: any) => {
          if (result != null) {
            let data = result;
            data.forEach((element: any, index: number) => {
              this.articles.push({
                title: element.title,
                url: element.url,
                image: element.image,
                description: element.description
              });
            });
          }
        },
        (error) => {
          if (error.status == 404) {

          }
          if (error.status == 500) {

          }
        }
      );
    }
  }

  resize() {
    this.screenSize.observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.Small]).subscribe(result => {
      this.fontSize = 40;
      this.gridListSize = 2;
      this.imageDoctorWidth = 40;
      this.moveSearchButton = false;
      this.quoteCardWidth = 600;
      if (result.matches) {
        this.fontSize = 18;
        this.gridListSize = 1;
        this.imageDoctorWidth = 75;
        this.moveSearchButton = true;
        this.quoteCardWidth = 300;
      }
    })
    this.screenSize.observe([Breakpoints.TabletLandscape]).subscribe(result => {
      if (result.matches) {
        this.fontSize = 25;
        this.gridListSize = 3;
        this.imageDoctorWidth = 25;
        this.moveSearchButton = false;
      }
    })
  }
}
