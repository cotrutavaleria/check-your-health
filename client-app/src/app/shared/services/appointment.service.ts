import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router, UrlSegment } from "@angular/router";
import { JWTService } from "./jwt.service";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FormGroup } from "@angular/forms";
import { UserService } from "./user.service";
@Injectable({ providedIn: 'root' })
export class AppointmentService {
    constructor(private jwtService: JWTService, public dialog: MatDialog, private httpClient: HttpClient, private router: Router, private route: ActivatedRoute, private message: MatSnackBar, private userService: UserService) { }

    public getPatientNotifications(token: string) {
        return this.httpClient.get<any>('http://localhost:8081/api/v1/notifications/patients', {
            headers: {
                "X-AUTH-TOKEN": token
            }
        });
    }

    public getDoctorNotifications(token: string) {
        return this.httpClient.get<any>('http://localhost:8081/api/v1/notifications/doctors', {
            headers: {
                "X-AUTH-TOKEN": token
            }
        });
    }

    public getPatientInformation(uuid: string) {
        return this.httpClient.get<any>('http://localhost:8081/api/v1/notifications/doctors/requests/' + uuid);
    }

    public acceptPatient(uuid: string, date: string, time: string, createdAt: any) {
        this.httpClient.put<any>('http://localhost:8081/api/v1/notifications/doctors/accepted/' + uuid, { date, time, createdAt }).subscribe(
            (result: any) => {
                window.location.reload();
            },
            (error) => {
                if (error.status == 409) {
                    console.log(error);
                    this.userService.openSnackBar("An error has been encountered! Please, reload your page and try again.");
                }
            }
        );
        setTimeout(() => window.location.reload(), 300);
    }
    public rejectPatient(uuid: string, date: string, time: string, createdAt: any) {
        console.log({ date, time, createdAt })
        this.httpClient.put<any>('http://localhost:8081/api/v1/notifications/doctors/rejected/' + uuid, { date, time, createdAt }).subscribe(
            (result: any) => {
                console.log(result);
                window.location.reload();
            },
            (error) => {
                if (error.status == 409) {
                    console.log(error);
                    this.userService.openSnackBar("An error has been encountered! Please, reload your page and try again.");
                }
            }
        );
    }

    public createAppointment(token: string, doctorUuid: string, data: {
        date: string,
        time: string,
        explanation: string,
        isNew: any,
        consultingTypes: any,
        totalAmount: number
    }, form: FormGroup) {
        if (data.isNew == false) {
            data.isNew = 0;
        } else {
            data.isNew = 1;
        }
        this.httpClient.post<any>('http://localhost:8081/api/v1/appointments/' + doctorUuid, data, {
            headers: {
                "X-AUTH-TOKEN": token
            }
        }).subscribe(
            (result: any) => {
                console.log(result);
                this.userService.openSnackBar("Your request has been sent!");
            },
            (error) => {
                if (error.status == 403) {
                    console.log(error);
                    form.setErrors({ 'FORBIDDEN': true });
                    this.userService.openSnackBar("A similar appointment has already been done. Choose another date or time.");
                }
                if (error.status == 404) {
                    console.log(error);
                    form.setErrors({ 'NOT_FOUND': true });
                    this.userService.openSnackBar("An error has encountered! Please, log in one more time.");
                }
                if (error.status == 500) {
                    console.log(error);
                    form.setErrors({ 'INTERNAL_SERVER_ERROR': true });
                    this.userService.openSnackBar("An error has encountered! Please, reload your page and try again.");
                }
            }
        );
    }

    public getPatientAppointments(page: number, size: number, token: string) {
        return this.httpClient.get<any>('http://localhost:8081/api/v1/appointments/patients?page=' + page + '&size=' + size, {
            headers: {
                "X-AUTH-TOKEN": token
            }
        });
    }

    public getDoctorAppointments(page: number, size: number, token: string) {
        return this.httpClient.get<any>('http://localhost:8081/api/v1/appointments/doctors?page=' + page + '&size=' + size, {
            headers: {
                "X-AUTH-TOKEN": token
            }
        });
    }
    public getConsultingTypes(uuid: string) {
        return this.httpClient.get<any>('http://localhost:8081/api/v1/appointments/doctors/' + uuid + '/consulting-types');
    }
}

export interface DailyProgramme {
    day: number;
    startsAt: string;
    endsAt: string;
}
