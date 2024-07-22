import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchBarAutocomplete } from 'src/app/shared/other-functionalities/search-bar-autocomplete';
import { JWTService } from 'src/app/shared/services/jwt.service';
import { SearchService } from 'src/app/shared/services/search.service';
import { UserService } from 'src/app/shared/services/user.service';
import { GoogleMapsComponent } from '../google-api/google-maps/google-maps.component';
import { AddressInputResponse, GoogleAdressesInputComponent } from '../../../shared/other-functionalities/google-adresses-input/google-adresses-input.component';
export interface DoctorInformation {
  uuid: string;
  name: string;
  specialties: any[];
  rate: number;
  workAddress: string;
  phoneNumber: string;
  image: string;
  showMore: boolean;
};
export interface Specialties {
  name: string;
};
@Component({
  selector: 'app-doctor-listing',
  templateUrl: './doctor-listing.component.html',
  styleUrls: ['./doctor-listing.component.css'],
})
export class DoctorListingComponent implements OnInit {
  @ViewChild(GoogleMapsComponent) googleMaps: GoogleMapsComponent;
  addressInput: AddressInputResponse = { address: '' };
  sourcePage = 'doctor-listing';

  moveSearchButton = false;

  data!: any;
  doctors: DoctorInformation[] = [];
  searchForm!: FormGroup;
  pageEvent!: PageEvent;
  length = 50;
  pageSize = 10;
  pageIndex = 0;
  notFound = false;
  isRomanianLang = localStorage.getItem("language") == "ro";

  placeholderText!: string;
  filteredOptions!: Observable<string[]>;
  doctorsNames: string[] = [];
  doctorsSpecialties: string[] = [];
  workAddress: string = '****';

  constructor(private screenSize: BreakpointObserver, private route: ActivatedRoute, private jwtService: JWTService, private searchService: SearchService,
    private form: FormBuilder, private userService: UserService, private router: Router, private searchBarAutocomplete: SearchBarAutocomplete) { }

  ngOnInit() {
    if (this.isRomanianLang) {
      this.placeholderText = "Locaţia...";
    } else {
      this.placeholderText = "Your location...";
    }
    this.resize();
    this.getQueryParams();
    this.filteredOptions = this.searchBarAutocomplete.filterOptions(this.searchForm, 'doctorSpecialtyOrName');
  }

  onSubmit(form: FormGroup) {
    this.filteredOptions = this.searchBarAutocomplete.filterOptions(this.searchForm, 'doctorSpecialtyOrName');
    if (this.workAddress != '****') {
      form.get('location').patchValue(this.workAddress);
    } else if (this.workAddress == '****') {
      this.workAddress = form.value.location;
    }
    if (this.addressInput.address != "") {
      form.get('location').patchValue(this.addressInput.address);
      this.workAddress = form.value.location;
    }
    form.get('name').patchValue("");
    form.get('specialty').patchValue("");
    this.addressInput.address = "";

    if (this.doctorsNames.includes(form.value.doctorSpecialtyOrName)) {
      form.get('name').patchValue(form.value.doctorSpecialtyOrName);
      this.specialtyAndNameRouting(form);
    } else if (this.doctorsSpecialties.includes(form.value.doctorSpecialtyOrName)) {
      form.get('specialty').patchValue(form.value.doctorSpecialtyOrName);
      this.specialtyAndNameRouting(form);
    } else {
      this.searchForm.get('name').patchValue(form.value.doctorSpecialtyOrName);
      this.searchForm.get('specialty').patchValue(form.value.doctorSpecialtyOrName);
      this.keywordRouting(form);
    }
  }

  specialtyAndNameRouting(form: FormGroup) {
    this.getDoctorList(this.pageIndex, this.pageSize, form.value.specialty, form.value.name, form.value.location);
    this.router.navigate(['/search'], {
      queryParams: { specialty: form.value.specialty, name: form.value.name, location: form.value.location }
    });
  }
  keywordRouting(form: FormGroup) {
    this.getDoctorList(this.pageIndex, this.pageSize, form.value.specialty, form.value.name, form.value.location);
    this.router.navigate(['/search'], {
      queryParams: { keyword: form.value.doctorSpecialtyOrName, location: form.value.location }
    });
  }

  onInput(value: string) {
    this.workAddress = value;
    console.log(this.workAddress)
  }

  changePage(event: PageEvent) {
    this.pageEvent = event;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.onSubmit(this.searchForm);
  }

  getDoctorList(pageIndex: number, pageSize: number, field1: string, field2: string, field3: string) {
    this.searchService.getDoctorsList(pageIndex, pageSize, field1, field2, field3)
      .subscribe(result => {
        if (result != null) {
          this.data = result.doctorList;
          this.doctors = [];
          if (this.data.length == 0) {
            this.notFound = true;
          } else {
            this.notFound = false;
          }
          this.data.forEach((element: any) => {
            let currentDoctorSpecialties = [];
            element.specialties.forEach(x => {
              if (this.isRomanianLang) {
                currentDoctorSpecialties.push(x.romanianName);
              } else {
                currentDoctorSpecialties.push(x.englishName);
              }
            });
            this.doctors.push({
              uuid: element.uuid,
              name: element.fullName,
              specialties: currentDoctorSpecialties,
              rate: element.rate,
              showMore: false,
              workAddress: element.workAddress,
              phoneNumber: element.phoneNumber,
              image: element.image != '' ? element.image : "./assets/profile/blank-profile-picture.png"
            });
          });
          this.length = result.totalElements;
        }
      },
        (error: any) => {
          this.notFound = true;
        }
      );
  }

  resize() {
    this.screenSize.observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.Small]).subscribe(result => {
      this.moveSearchButton = false;
      if (result.matches) {
        this.moveSearchButton = true;
      }
    })
    this.screenSize.observe([Breakpoints.TabletLandscape]).subscribe(result => {
      if (result.matches) {
        this.moveSearchButton = false;
      }
    })
  }

  getQueryParams() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.searchForm = this.form.group({
        doctorSpecialtyOrName: queryParams.get('specialty') + queryParams.get('name'),
        specialty: '',
        name: '',
        location: queryParams.get('location')
      });
      if (queryParams.get('keyword') != null) {
        this.searchForm.get('doctorSpecialtyOrName').patchValue(queryParams.get('keyword'));
      }
      if ("null0".includes(this.searchForm.value.doctorSpecialtyOrName)) {
        this.searchForm.get('doctorSpecialtyOrName').patchValue("");
        this.onSubmit(this.searchForm);
      } else {
        this.doctorsNames = this.searchBarAutocomplete.readAllDoctorsNames();
        this.doctorsSpecialties = this.searchBarAutocomplete.readAllSpecialties();
        console.log("hehe", this.doctorsSpecialties)
        if (this.doctorsNames.includes(this.searchForm.value.doctorSpecialtyOrName)) {
          this.searchForm.get('name').patchValue(this.searchForm.value.doctorSpecialtyOrName);
        } else if (this.doctorsSpecialties.includes(this.searchForm.value.doctorSpecialtyOrName)) {
          this.searchForm.get('specialty').patchValue(this.searchForm.value.doctorSpecialtyOrName);
        } else {
          this.searchForm.get('name').patchValue(this.searchForm.value.doctorSpecialtyOrName);
          this.searchForm.get('specialty').patchValue(this.searchForm.value.doctorSpecialtyOrName);
        }
        this.getDoctorList(this.pageIndex, this.pageSize, this.searchForm.value.specialty, this.searchForm.value.name, this.searchForm.value.location);
        this.workAddress = this.searchForm.value.location;
      }
    });
  }

  getDoctorsByClickSpecialty(field1: string) {
    this.router.navigate(['/search'], {
      queryParams: { specialty: field1, name: "", location: "" }
    });
  }

  openMoreInformation(doctor: DoctorInformation) {
    this.router.navigateByUrl('/doctor/' + doctor.uuid);
  }

  showMarkerMapLocations(workAddress: string) {
    this.googleMaps.findAddress(workAddress);
  }
}