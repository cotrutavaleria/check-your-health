import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router, UrlSegment } from "@angular/router";
import { JWTService } from "./jwt.service";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FormGroup } from "@angular/forms";
import { UserService } from "./user.service";
@Injectable({ providedIn: 'root' })
export class ScheduleService {
    constructor(private jwtService: JWTService, public dialog: MatDialog, private httpClient: HttpClient, private router: Router, private route: ActivatedRoute, private message: MatSnackBar, private userService: UserService) { }

    public getDoctorsSchedule(token: string) {
        return this.httpClient.get<any>('http://localhost:8081/api/v1/doctors-schedules', {
            headers: {
                "X-AUTH-TOKEN": token
            }
        });
    }

    public updateDoctorsWorkingSchedule(schedule: DailyProgramme[], token: string, form: FormGroup) {
        let weeklyProgramme = { weeklyProgramme: schedule };
        console.log(weeklyProgramme);
        this.httpClient.put<any>('http://localhost:8081/api/v1/doctors-schedules', weeklyProgramme, {
            headers: {
                "X-AUTH-TOKEN": token
            }
        }).subscribe(
            (result: any) => {
                console.log(result);
                this.userService.openSnackBar("Your working schedule has been updated!");
            },
            (error) => {
                if (error.status == 403) {
                    console.log(error);
                    form.setErrors({ 'FORBIDDEN': true });
                    this.userService.openSnackBar("Your e-mail address is not valid!");
                }
                if (error.status == 500) {
                    console.log(error);
                    form.setErrors({ 'INTERNAL_SERVER_ERROR': true });
                    this.userService.openSnackBar("An error has encountered! Please, reload your page and try again.");
                }
            }
        );
    }

    public getAvailableHours(date: string, uuid: string) {
        return this.httpClient.get<any>('http://localhost:8081/api/v1/doctors-schedules/' + uuid + '/available-hours/' + date);
    }

}

export interface DailyProgramme {
    day: number;
    startsAt: string;
    endsAt: string;
}
