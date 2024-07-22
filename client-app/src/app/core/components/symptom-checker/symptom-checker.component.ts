import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { SymptomService } from 'src/app/shared/services/symptom.service';
import { UserService } from 'src/app/shared/services/user.service';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef, } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-symptom-checker',
  templateUrl: './symptom-checker.component.html',
  styleUrls: ['./symptom-checker.component.css']
})
export class SymptomCheckerComponent implements OnInit {
  checkedSymptoms: string[] = [];
  allSymptoms: any[] = [];
  categories: string[] = [];
  isLoading = true;
  constructor(private _bottomSheet: MatBottomSheet, private _symptomService: SymptomService, private cdr: ChangeDetectorRef, private userService: UserService) { }

  ngOnInit(): void {
    this.getSymptomCategories();
    this.getSymptoms();
  }

  checkSymptom(symptom: string) {
    let firstLetter = symptom[0];
    firstLetter = firstLetter.toLowerCase();
    symptom = firstLetter + symptom.substring(1);
    if (this.checkedSymptoms.includes(symptom)) {
      let index = this.checkedSymptoms.indexOf(symptom);
      this.checkedSymptoms.splice(index, 1);
    } else {
      this.checkedSymptoms.push(firstLetter + symptom.substring(1));
    }
    console.log("current checked symptoms:", this.checkedSymptoms)
  }

  getSymptoms() {
    this._symptomService.getSymptoms().subscribe(
      (result: any) => {
        if (result != null) {
          this.allSymptoms = result['symptoms'];
        }
      }
    )
  }

  getSymptomCategories(): void {
    this._symptomService.getSymptomCategories().subscribe(
      (result: any) => {
        if (result != null && result['categories']) {
          this.categories = result['categories'];
          console.log(this.categories)
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      (error) => {
        console.error('Error fetching symptom categories', error);
      }
    );
  }
  openBottomSheet(data: any): void {
    this._bottomSheet.open(DiseaseInformation, {
      data: data
    });
  }

  checkHealthStatus() {
    let data = { symptoms: this.checkedSymptoms };
    this._symptomService.checkSymptoms(data).subscribe(
      (result: any) => {
        console.log(result);
        let precautions = result.precautions;
        
        let data = {
          name: result.disease,
          description: result.description,
          precautions: precautions
        }
        this.openBottomSheet(data);
      },
      (error) => {
        if (error.status == 409) {
          console.log(error);
          this.userService.openSnackBar("The symptoms provided are not valid. Please, try again.");
        }
        if (error.status == 500) {
          console.log(error);
          this.userService.openSnackBar("An error has encountered! Please, reload your page and try again.");
        }
      });
  }
}

@Component({
  selector: 'app-disease-information',
  templateUrl: './disease-information/disease-information.component.html',
  styleUrls: ['./disease-information/disease-information.component.css']

})
export class DiseaseInformation {
  constructor(private _bottomSheet: MatBottomSheetRef<DiseaseInformation>,
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      name: string,
      description: string,
      precautions: any
    }) { }
  openLink(event: MouseEvent): void {
    console.log(this.data.name, this.data.description, this.data.precautions)
    this._bottomSheet.dismiss();
    event.preventDefault();
  }
}