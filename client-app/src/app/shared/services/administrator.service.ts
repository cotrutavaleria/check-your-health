import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router, UrlSegment } from "@angular/router";
import { JWTService } from "./jwt.service";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
@Injectable({ providedIn: 'root' })
export class AdministratorServices {
    constructor(private jwtService: JWTService, public dialog: MatDialog, private httpClient: HttpClient, private router: Router, private route: ActivatedRoute) { }
    acceptDoctorRequest(element: any) {
        this.httpClient.put('http://localhost:8081/api/v1/doctor-applications/' + element.email + '/accepted', element.email)
            .subscribe(result => {
            },
                (error) => {
                    if (error.status == 409) {
                        element.setErrors({ 'CONFLICT': true });
                    }
                });
        window.location.reload();

    }
    rejectDoctorRequest(element: any) {
        this.httpClient.delete('http://localhost:8081/api/v1/doctor-applications/' + element.email + '/rejected', element.email)
            .subscribe(result => {
                window.location.reload();
            },
                (error) => {
                    if (error.status == 409) {
                        element.setErrors({ 'CONFLICT': true });
                    }
                });
    }

    rejectThroughEmail(emailAddress: any, message: any) {
        console.log(emailAddress)
        console.log(message)
        this.httpClient.post<any>('http://localhost:8081/api/v1/doctor-applications/' + emailAddress + '/email-rejected', { "message": message })
            .subscribe(result => {
                window.location.reload();
            },
                (error) => {
                    if (error.status == 409) {
                    }
                });
    }
}
