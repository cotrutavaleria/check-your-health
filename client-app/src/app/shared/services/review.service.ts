import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router, UrlSegment } from "@angular/router";
import { JWTService } from "./jwt.service";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FormGroup } from "@angular/forms";
import { UserService } from "./user.service";
@Injectable({ providedIn: 'root' })
export class ReviewService {
    constructor(private jwtService: JWTService, public dialog: MatDialog, private httpClient: HttpClient, private router: Router, private route: ActivatedRoute, private message: MatSnackBar, private userService: UserService) { }

    public postReview(patientToken: string, data: {
        stars: number,
        comment: string,
        doctorUuid: string
    }, form: FormGroup) {
        this.httpClient.post<any>('http://localhost:8081/api/v1/reviews/patients', data, {
            headers: {
                "X-AUTH-TOKEN": patientToken
            }
        }).subscribe(
            (result: any) => { },
            (error) => {
                if (error.status == 404) {
                    console.log(error);
                    form.setErrors({ 'NOT_FOUND': true });
                    this.userService.openSnackBar("An error has encountered! Please, log in one more time.");
                }
            }
        );
    }



    public getReviewsForDoctor(doctorUuid: string) {
        return this.httpClient.get<any>('http://localhost:8081/api/v1/reviews/doctors/' + doctorUuid);
    }
}

