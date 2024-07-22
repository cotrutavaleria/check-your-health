import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SearchBarAutocomplete } from 'src/app/shared/other-functionalities/search-bar-autocomplete';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  searchForm!: FormGroup;
  doctorsNames: string[] = [];
  doctorsSpecialties: string[] = [];
  name: string = "";
  specialty: string = "";

  constructor(public dialog: MatDialogRef<MatDialog>, private router: Router, private form: FormBuilder, private searchBarAutocomplete: SearchBarAutocomplete) {
    this.searchForm = this.form.group({
      specialtyOrDoctorName: ['', [Validators.required]],
      location: ['', [Validators.required]],
    });

  }
  closeDialog() {
    this.dialog.close();
  }
  onSubmit(form: FormGroup) {
    this.closeDialog();
    if (form.value.specialtyOrDoctorName == '') {
      console.log("am trimis");
      this.keywordRouting(form);
    }
    else if (form.value.specialtyOrDoctorName != '') {
      this.doctorsNames = this.searchBarAutocomplete.readAllDoctorsNames();
      this.doctorsSpecialties = this.searchBarAutocomplete.readAllSpecialties();

      if (this.doctorsNames.includes(form.value.specialtyOrDoctorName)) {
        this.name = form.value.specialtyOrDoctorName;
        this.specialtyAndNameRouting(form);
      } else if (this.doctorsSpecialties.includes(form.value.specialtyOrDoctorName)) {
        this.specialty = form.value.specialtyOrDoctorName;
        this.specialtyAndNameRouting(form);
      } else {
        this.keywordRouting(form);
      }
    }
  }

  specialtyAndNameRouting(form: FormGroup) {
    console.log(form.value.location, "spec", this.specialty, 'name', this.name);
    this.router.navigate(['/search'], {
      queryParams: { specialty: this.specialty, name: this.name, location: form.value.location }
    });
  }

  keywordRouting(form: FormGroup) {
    console.log("hoh", form.value.location, "spec", this.specialty, 'name', this.name);

    this.router.navigate(['/search'], {
      queryParams: { keyword: form.value.specialtyOrDoctorName, location: form.value.location }
    });
  }
}
