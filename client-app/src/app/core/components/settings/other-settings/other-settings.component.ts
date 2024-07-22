import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { JWTService } from 'src/app/shared/services/jwt.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AddressInputResponse, GoogleAdressesInputComponent } from '../../../../shared/other-functionalities/google-adresses-input/google-adresses-input.component';
@Component({
  selector: 'app-other-settings',
  templateUrl: './other-settings.component.html',
  styleUrls: ['./other-settings.component.css']
})
export class OtherSettingsComponent implements OnInit {
  alignItemsMode!: string;
  data: any[] = [];
  flexDirectionMode!: string;
  widthSize!: number;
  marginLeftSize!: number;
  token!: string;
  specialtiesFromDatabase: any[] = [];
  isRomanianLang = localStorage.getItem('language') == 'ro';
  consultingTypes: any[] = [];
  consultationNames: any;
  firstSpecialty!: FormControl;
  updateAdditionalInformation!: FormGroup;
  addedSpecialties: string[] = [];
  profileImage = './assets/profile/blank-profile-picture.png';
  placeholderText!: string;
  sourcePage = 'additional-doctor-settings';
  addressInput: AddressInputResponse = { address: '' };
  workAddress: string = "";
  constructor(private cd: ChangeDetectorRef, private form: FormBuilder, private screenSize: BreakpointObserver, private jwtService: JWTService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    if (localStorage.getItem("language") == "ro") {
      this.placeholderText = "Locaţia...";
    } else {
      this.placeholderText = "Your location...";
    }
    this.updateAdditionalInformation = this.form.group({
      workAddress: ['', [Validators.required, Validators.minLength(4)]],
      specialtyAndConsultationInfo: this.form.array([])
    });
    this.resize();
    this.getDoctorInformation();
  }

  specialtyAndConsultationInfo(): FormArray {
    return this.updateAdditionalInformation.get('specialtyAndConsultationInfo') as FormArray;
  }

  newSpecialty(): FormGroup {
    return this.form.group({
      specialty: '',
      consultingTypeInfo: this.form.array([])
    });
  }

  newSpecialtyParam(specialty: string): FormGroup {
    return this.form.group({
      specialty: specialty,
      consultingTypeInfo: this.form.array([])
    });
  }
  addSpecialty() {
    this.specialtyAndConsultationInfo().push(this.newSpecialty());
    this.cd.detectChanges();
  }
  addSpecialtyFromDataBase(specialty: string) {
    this.specialtyAndConsultationInfo().push(this.newSpecialtyParam(specialty));
  }

  removeSpecialty(specialtyIndex: number) {
    this.addedSpecialties = this.addedSpecialties.filter((specialty: any) => specialty.englishName != this.specialtyAndConsultationInfo().at(specialtyIndex).value.specialty);
    this.specialtyAndConsultationInfo().removeAt(specialtyIndex);
  }

  consultationsTypesList(specialtyIndex: number): FormArray {
    return this.specialtyAndConsultationInfo()
      .at(specialtyIndex)
      .get('consultingTypeInfo') as FormArray;
  }

  newConsultationType(): FormGroup {
    return this.form.group({
      name: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/(?=.*[a-zA-Z\d]).{,50}/)]],
      price: ['', [Validators.required, Validators.pattern(/\b(?!0\d)\d+(\.\d{2})?\b/)]],
    });
  }

  addConsultationType(specialtyIndex: number) {
    this.consultationsTypesList(specialtyIndex).push(this.newConsultationType());
    this.cd.detectChanges();

  }

  removeConsultationType(specialtyIndex: number, consultationIndex: number) {
    this.consultationsTypesList(specialtyIndex).removeAt(consultationIndex);
  }

  newConsultationTypeParam(name: string, price: string): FormGroup {
    return this.form.group({
      name: name,
      price: price
    });
  }

  addConsultationTypeParam(specialtyIndex: number, name: string, price: string) {
    this.consultationsTypesList(specialtyIndex).push(this.newConsultationTypeParam(name, price));
  }

  getCorrrectWorkAddress() {
    if (this.addressInput.address != "") {
      return this.addressInput.address;
    }
    return this.workAddress;
  }

  onSubmit(form: FormGroup) {
    let pricePattern = /\b(?!0\d)\d+(\.\d{2})?\b/;
    let error = false;
    let token = this.jwtService.getJWT();
    this.updateAdditionalInformation.get('workAddress').patchValue(this.getCorrrectWorkAddress());
    this.addressInput.address = "";
    if (form.value.specialtyAndConsultationInfo.length == 0) {
      this.userService.openSnackBar("As a medical professional, it's important to possess at least one specialty. Please add one.");
      error = true;
    } else {
      form.value.specialtyAndConsultationInfo.forEach(element => {
        if (element.consultingTypeInfo.length != 0) {
          element.consultingTypeInfo.forEach(consultingType => {
            if (!pricePattern.test(consultingType.price) || consultingType.name.length < 4) {
              this.userService.openSnackBar("Some fields are not correctly completed, specifically consulting types or prices.");
              error = true;
            }
          });
        }
      });
    }
    if (form.value.workAddress.length < 4) {
      this.userService.openSnackBar("Your work address must contain at least 4 characters.");
      error = true;
    }
    if (!error) {
      if (token) {
        console.log({ workAddress: form.value.workAddress, additionalDoctorInformation: form.value.specialtyAndConsultationInfo }, this.token,)
        if (localStorage.getItem("language") == "ro") {
          console.log("her")
          form.value.specialtyAndConsultationInfo.forEach(element => {
            console.log(element.specialty)
            this.data.forEach(sp => {
              if (sp.romanianName == element.specialty){
                element.specialty = sp.englishName;
              }
          })
          });
        }
        console.log({ workAddress: form.value.workAddress, additionalDoctorInformation: form.value.specialtyAndConsultationInfo }, this.token,)
        this.userService.updateAdditionalInformation({ workAddress: form.value.workAddress, additionalDoctorInformation: form.value.specialtyAndConsultationInfo }, this.token, form);
      }
    }
  }

  onInput(value: string) {
    this.workAddress = value;
  }

  resize() {
    this.screenSize.observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.Small]).subscribe(searchResponse => {
      this.alignItemsMode = 'flex-start';
      this.flexDirectionMode = 'row';
      this.marginLeftSize = 100;
      this.widthSize = 60;
      if (searchResponse.matches) {
        this.alignItemsMode = 'center';
        this.flexDirectionMode = 'column';
        this.widthSize = 80;
        this.marginLeftSize = 0;
      }
    })
  }

  getDoctorInformation() {
    this.token = this.jwtService.getJWT();
    this.userService.getUserInformation(this.token).subscribe(
      (result: any) => {
        if (result != null) {
          if (result.image != null && result.image != "") {
            this.profileImage = result.image;
          }
          if (localStorage.getItem("language") == "en") {
            this.firstSpecialty = result.specialties[0].englishName;
          } else {
            this.firstSpecialty = result.specialties[0].romanianName;
          }
          this.workAddress = result.workAddress;
          this.updateAdditionalInformation = this.form.group({
            workAddress: [result.workAddress, [Validators.required, Validators.minLength(4)]],
            specialtyAndConsultationInfo: this.form.array([])
          });
          this.specialtiesFromDatabase = result.specialties;
          this.consultingTypes = result.consultingTypes;
          this.getAllSpecialtiesRemove(this.specialtiesFromDatabase);
          this.specialtiesFromDatabase.forEach((specialty: any, index: number) => {
            if (localStorage.getItem("language") == "en") {
              this.addSpecialtyFromDataBase(specialty.englishName);
            } else {
              this.addSpecialtyFromDataBase(specialty.romanianName);
            }
            if (this.consultingTypes.length !== 0) {
              this.consultingTypes.forEach((element: any) => {
                if (element.specialtyId === specialty.id) {
                  this.addConsultationTypeParam(index, element.name, element.price);
                }
              });

            }
          });
        }
      }
    ), (error: any) => {
      if (error.status == 401 || error.status == 500) {
        this.userService.logout();
      }
    };
  }

  logout() {
    this.jwtService.destroyJWT();
    setTimeout(() => {
      window.location.reload();
    }, 10);
    this.router.navigateByUrl('/auth/login');
  }

  getAllSpecialtiesRemove(specialtiesFromDatabase: any[] = []) {
    this.userService.getAllSpecialties().subscribe(
      (result: any) => {
        if (result != null) {
          this.data = result;
          specialtiesFromDatabase.forEach((element: any) => {
            this.addedSpecialties.push(this.data.at(element.id - 1));
          });
        }
      }
    );
  }

  addToSpecialties(specialty: any) {
    this.addedSpecialties.push(specialty);
    let currentSpecialties = [];
    this.updateAdditionalInformation.value.specialtyAndConsultationInfo.forEach(element => {
      currentSpecialties.push(element.specialty);
    });
    this.addedSpecialties = this.addedSpecialties.filter((specialty: any) => currentSpecialties.includes(specialty.englishName) || currentSpecialties.includes(specialty.romanianName));
  }
}

