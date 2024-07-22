import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgModel } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from 'src/app/shared/services/user.service';
import { AddressInputResponse, GoogleAdressesInputComponent } from '../../../shared/other-functionalities/google-adresses-input/google-adresses-input.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  hide1 = true;
  hide2 = true;
  workAddress!: string;
  data!: any;
  isRomanianLang = localStorage.getItem("language") == "ro";
  passwordsMatch = true;
  showAdditionalDoctorInformation = false;
  sourcePage = 'sign-up';
  addressInput: AddressInputResponse = { address: '' };
  additionalDoctorInformation: FormGroup<{ specialty: FormControl<string>; workAddress: FormControl<string>; }>;
  personalInformation: FormGroup<{ fullName: FormControl<string>; gender: FormControl<string>; birthdate: FormControl<number>; emailAddress: FormControl<string>; phoneNumber: FormControl<string>; password: FormControl<string>; passwordConfirmation: FormControl<string>; }>;
  isDoctorQuestion: FormGroup<{ isDoctor: FormControl<string>; }>;
  placeholderText!: string;
  constructor(private form: FormBuilder, public dialog: MatDialog, private authentication: UserService) {
    this.getAllSpecialties();
    this.buildIsDoctorForm();
    this.buildPersonalInformationForm();
    this.buildAdditionalInformationForm();
    if (this.isRomanianLang) {
      this.placeholderText = "Introdu o locaţie";
    } else {
      this.placeholderText = "Enter a location";
    }
  }

  getAllSpecialties() {
    this.authentication.getAllSpecialties().subscribe(
      (result: any) => {
        if (result != null) {
          this.data = result;
          this.data.forEach((element: any) => {
          });
        }
      }
    );
  }

  buildIsDoctorForm() {
    this.isDoctorQuestion = this.form.group({
      isDoctor: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(2)]),
    });
  }

  buildPersonalInformationForm() {
    this.personalInformation = this.form.group({
      fullName: ['valeria', [Validators.required, Validators.minLength(4)]],
      gender: ['Female', Validators.required],
      birthdate: [Date.now(), Validators.required],
      emailAddress: ['leracotruta@gmail.com', [Validators.required, Validators.email]],
      phoneNumber: ['1234567890', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['valeriaC123@', [Validators.required, Validators.pattern(/(?=.*[a-zA-Z@$!%*#?&^_-\d]).{8,}/)]],
      passwordConfirmation: ['valeriaC123@', Validators.required],
    });
  }

  buildAdditionalInformationForm() {
    this.additionalDoctorInformation = this.form.group({
      specialty: ['', Validators.required],
      workAddress: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  showAdditionalInformationForm() {
    if (this.isDoctorQuestion.controls.isDoctor.value === "Yes") {
      this.showAdditionalDoctorInformation = true;
    }
    if (this.isDoctorQuestion.controls.isDoctor.value != '') {
      this.isDoctorQuestion.get('isDoctor')?.disable();
    }
  }

  onInput(value: string) {
    this.workAddress = value == "" ? this.workAddress : value;
    this.setAddress();
  }

  setAddress() {
    console.log("form", this.additionalDoctorInformation.value.workAddress);
    console.log("input", this.addressInput.address);
    console.log("work", this.workAddress);
    if (this.workAddress != this.addressInput.address && this.addressInput.address != "") {
      this.additionalDoctorInformation.get('workAddress')?.patchValue(this.addressInput.address);
      console.log("here");
    } else if (this.addressInput.address == "") {
      this.additionalDoctorInformation.get('workAddress')?.patchValue(this.workAddress);
      console.log("there");
    }

    this.addressInput.address = "";
    this.workAddress = this.additionalDoctorInformation.value.workAddress;
    console.log("form", this.additionalDoctorInformation.value.workAddress);
    console.log("input", this.addressInput.address);
    console.log("work", this.workAddress);
  }

  submitSignUpInformation(additionalDoctorInformation: FormGroup, personalInformation: FormGroup) {
    let user: any;
    let birthdate = formatDate(personalInformation.value.birthdate, 'yyyy-MM-dd', "en-US");
    if (!this.showAdditionalDoctorInformation) {
      user = { fullName: personalInformation.value.fullName, gender: personalInformation.value.gender, birthdate: birthdate, emailAddress: personalInformation.value.emailAddress, phoneNumber: personalInformation.value.phoneNumber, password: personalInformation.value.password, passwordConfirmation: personalInformation.value.passwordConfirmation };
      this.authentication.signupPatient(user, this.personalInformation);
    } else {
      user = { specialty: additionalDoctorInformation.value.specialty, workAddress: additionalDoctorInformation.value.workAddress, fullName: personalInformation.value.fullName, gender: personalInformation.value.gender, birthdate: birthdate, emailAddress: personalInformation.value.emailAddress, phoneNumber: personalInformation.value.phoneNumber, password: personalInformation.value.password, passwordConfirmation: personalInformation.value.passwordConfirmation };
      if (this.isRomanianLang) {
        this.data.forEach(element => {
          if (element.romanianName == additionalDoctorInformation.value.specialty) {
            user.specialty = element.englishName;
          }
        });
      }
      this.authentication.signupDoctor(user, this.personalInformation);
    }
  }
}
