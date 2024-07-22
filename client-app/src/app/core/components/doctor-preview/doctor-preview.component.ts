import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InfoDialogSetAppointmentComponent } from '../../../shared/other-resources/dialogs/set-appointment-dialog/set-appointment-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { JWTService } from 'src/app/shared/services/jwt.service';
import { ReviewService } from 'src/app/shared/services/review.service';
import { ScheduleService } from 'src/app/shared/services/schedule.service';
import { SearchService } from 'src/app/shared/services/search.service';
import { UserService } from 'src/app/shared/services/user.service';

export interface DoctorInformation {
  uuid: string;
  name: string;
  specialties: any[];
  rate: string;
  workAddress: string;
  phoneNumber: string;
  image: string;
};

export interface Review {
  patientName: string;
  stars: number;
  comment: string;
  emptyStars: number[];
  fullStars: number[];
  patientProfileImage: string;
}

@Component({
  selector: 'app-doctor-preview',
  templateUrl: './doctor-preview.component.html',
  styleUrls: ['./doctor-preview.component.css']
})
export class DoctorPreviewComponent implements OnInit {
  noReviews!: boolean;
  cardsHeight!: number;
  cardsWidth!: number;
  flexDirectionLeftSide!: string;
  alignItemsRightCard!: string;
  yourReviewCardWidth!: number;
  doctor!: DoctorInformation;
  isRomanianLang = localStorage.getItem("language") == "ro";
  patient = ({
    image: "./assets/profile/blank-profile-picture.png",
    name: 'you'
  });
  selected = new Date();
  selectedDate!: string | null;
  availableHours: string[] = [];
  consultingTypes: any[] = [];
  emptyStars = 5;
  fullStars = 0;
  unrated!: number[];
  rated!: number[];
  reviewForm!: FormGroup;
  token!: string;
  reviews: Review[] = [];

  constructor(private dialog: MatDialog, private screenSize: BreakpointObserver, private router: Router,
    private searchService: SearchService, private scheduleService: ScheduleService, private userService: UserService,
    private appointmentService: AppointmentService, private form: FormBuilder, private jwtService: JWTService, private reviewService: ReviewService) { }

  ngOnInit() {
    this.doctor = ({
      uuid: '',
      name: '',
      specialties: [''],
      rate: "0.0",
      workAddress: '',
      phoneNumber: '',
      image: './assets/profile/blank-profile-picture.png'
    });

    this.token = this.jwtService.getJWT();
    this.resize();
    this.getDoctor();
    this.initRatingArrays(this.emptyStars, 1, this.fullStars);

    this.reviewForm = this.form.group({
      comment: ''
    });
  }

  getDoctor() {
    let url = this.router.url.split("/");
    this.searchService.getDoctorByUuid(url[2]).subscribe((result: any) => {
      if (result != null) {
        console.log(result);
        this.doctor = ({
          uuid: result.uuid,
          name: result.fullName,
          specialties: result.specialties,
          rate: "0.0",
          workAddress: result.workAddress,
          phoneNumber: result.phoneNumber,
          image: result.image != '' ? result.image : "./assets/profile/blank-profile-picture.png"
        });
        this.getPatientName();
        this.getConsultingTypes(this.doctor.uuid);
        this.getAvailableHours();
        this.getReviewsForDoctor();
      }
    },
      (error: any) => {
        this.router.navigateByUrl('/**');
      });
  }

  resize() {
    this.screenSize.observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.Small]).subscribe(result => {
      this.flexDirectionLeftSide = 'row';
      this.alignItemsRightCard = 'flex-start';
      this.yourReviewCardWidth = 700;
      this.cardsHeight = 420;
      this.cardsWidth = 400;
      if (result.matches) {
        this.yourReviewCardWidth = 300;
        this.flexDirectionLeftSide = 'column';
        this.alignItemsRightCard = 'center';
        this.cardsHeight = 320;
        this.cardsWidth = 300;
      }
    })
  }

  getAvailableHours() {
    this.selectedDate = formatDate(this.selected, 'yyyy-MM-dd', "en-US");
    this.scheduleService.getAvailableHours(this.selectedDate, this.doctor.uuid).subscribe((result: any) => {
      if (result != null) {
        this.availableHours = result.availableHours;
      }
    },
      (error: any) => {
        if (error.status == 404) {
          this.userService.openSnackBar("The doctor you try to access is not found. Please, search again.");
        }
        if (error.status == 500) {
          this.userService.openSnackBar("An error has occured. Reload the page.");
        }
      });
  }

  getConsultingTypes(uuid: string) {
    this.appointmentService.getConsultingTypes(uuid).subscribe((result: any) => {
      if (result != null) {
        this.consultingTypes = result;
      }
    },
      (error: any) => {
        if (error.status == 500) {
          this.userService.openSnackBar("An error has occured. Reload the page.");
        }
      });
  }

  createAppointment(time: string, uuid: string, consultingTypesArray: any) {
    const dialogContent = this.dialog.open(InfoDialogSetAppointmentComponent, {
      data: { uuid: uuid, date: this.selectedDate, time: time, consultingTypesArray: consultingTypesArray },
    });
  }

  searchBySpecialty(field1: string) {
    this.router.navigate(['/search'], {
      queryParams: { specialty: field1, name: "", location: "" }
    });
  }

  rateDoctorServices(star: number) {
    this.emptyStars = 5;
    this.fullStars = 0;
    this.emptyStars -= star;
    this.fullStars = star;
    this.initRatingArrays(this.emptyStars, star + 1, this.fullStars);
    console.log("star: ", star, "emptyStars: ", this.emptyStars, "fullStars: ", this.fullStars, "rated: ", this.rated, "unrated: ", this.unrated);
  }

  initRatingArrays(emptyStars: number, addTo: number, fullStars: number) {
    this.unrated = Array.from({ length: emptyStars }).map((_, i) => i + addTo);
    this.rated = Array.from({ length: fullStars }).map((_, i) => i + 1);
  }

  onSubmit(form: FormGroup) {
    if (this.fullStars == 0) {
      this.userService.openSnackBar("Please, provide a rating of at least 1 star.");
    } else {
      let data = {
        stars: this.fullStars,
        comment: form.value.comment,
        doctorUuid: this.doctor.uuid
      }
      console.log(data);
      if (this.token) {
        this.reviewService.postReview(this.token, data, form);
        this.reviews.push({
          patientName: this.patient.name,
          stars: this.fullStars,
          comment: form.value.comment,
          emptyStars: Array.from({ length: 5 - this.fullStars }).map((_, i) => i + this.fullStars),
          fullStars: Array.from({ length: this.fullStars }).map((_, i) => i + 1),
          patientProfileImage: this.patient.image
        });

      } else {
        this.userService.openSnackBar("To let a review, you should be connected.");
        setTimeout(() => this.userService.logout(), 50);
      }
    }
  }

  getPatientName() {
    if (this.token) {
      this.userService.getUserInformation(this.token).subscribe(
        (result: any) => {
          if (result != null) {
            console.log("result", result)
            this.patient = ({
              name: result.fullName,
              image: result.image != '' ? result.image : "./assets/profile/blank-profile-picture.png"
            });
          }
        }

      ), (error: any) => {
        if (error.status == 401 || error.status == 500) {
          this.userService.logout();
        }
      };
    } else {
      console.log("Invalid token");
    }
  }

  getReviewsForDoctor() {
    this.reviews = [];
    this.reviewService.getReviewsForDoctor(this.doctor.uuid).subscribe(
      (result: any) => {
        if (result != null) {
          console.log(result)
          let data = result.reviews;
          this.doctor.rate = result.ratingAverage;

          if (data.length == 0) {
            this.noReviews = true;
          } else {
            this.noReviews = false;
          }

          data.forEach((element: any) => {
            this.reviews.push({
              patientName: element.name,
              stars: element.stars,
              comment: element.comment,
              emptyStars: Array.from({ length: 5 - element.stars }).map((_, i) => i + element.stars),
              fullStars: Array.from({ length: element.stars }).map((_, i) => i + 1),
              patientProfileImage: element.patientProfileImageUrl != '' ? element.patientProfileImageUrl : "./assets/profile/blank-profile-picture.png"
            });
          });
          this.doctor.rate = result.ratingAverage;
          console.log(this.reviews)
        }
      }
    ), (error: any) => {
      if (error.status == 401 || error.status == 500) {
        this.userService.logout();
      }
    };
  }
}