import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Observable, combineLatest, forkJoin, map, merge, reduce, startWith } from "rxjs";
import { UserService } from "../services/user.service";
import { SearchService } from "../services/search.service";

@Injectable({ providedIn: 'root' })
export class SearchBarAutocomplete {
  data!: any;
  filteredOptions1!: Observable<string[]>;
  filteredOptions2!: Observable<string[]>;
  optionsArray: string[] = [];
  names: string[] = [];
  specialties: string[] = [];

  constructor(private userService: UserService, private searchService: SearchService) {
    this.getAllSpecialties();
    this.getAllDoctors();
  }

  filterOptions(form: FormGroup, formControlName1: string) {
    this.filteredOptions1 = form.controls[formControlName1].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    return this.filteredOptions1;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsArray.filter(option => option.toLowerCase().includes(filterValue));
  }

  private getAllSpecialties() {
    this.userService.getAllSpecialties().subscribe(
      (result: any) => {
        if (result != null) {
          this.data = result;
          this.data.forEach((element: any) => {
            if (localStorage.getItem("language") == "en") {
              this.specialties.push(element.englishName);
            }else{
              this.specialties.push(element.romanianName);
            }
          });
          this.optionsArray = this.specialties;
        }
      }
    );
  }

  public readAllSpecialties() {
    return this.specialties;
  }

  public readAllDoctorsNames() {
    return this.names;
  }

  private getAllDoctors() {
    this.searchService.getAllDoctors().subscribe(result => {
      if (result != null) {
        result.forEach((element: any) => {
          this.optionsArray.push(element.fullName);
          this.names.push(element.fullName);
        });
      } else {
        console.log("No doctors found.");
      }
    });
  }
}