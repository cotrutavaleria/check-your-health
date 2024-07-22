import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router, UrlSegment } from "@angular/router";
import { JWTService } from "./jwt.service";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FormGroup } from "@angular/forms";
import { UserService } from "./user.service";
@Injectable({ providedIn: 'root' })
export class SymptomService {
    constructor(private jwtService: JWTService, public dialog: MatDialog, private httpClient: HttpClient, private router: Router, private route: ActivatedRoute, private message: MatSnackBar, private userService: UserService) { }

    public getSymptoms() {
        return this.httpClient.get<any>('http://127.0.0.1:8082/api/v1/symptoms');
    }

    public getSymptomCategories() {
        return this.httpClient.get<any>('http://127.0.0.1:8082/api/v1/categories');
    }

    public checkSymptoms(symptoms) {
        let jwtToken = this.jwtService.getJWT();
        if (jwtToken) {
            return this.httpClient.post<any>('http://127.0.0.1:8082/api/v1/health-status', symptoms, {
                headers: {
                    "Access-Control-Allow-Origin": 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
                }
            });
        }else{
            this.userService.openSnackBar("In order to check your symptoms, create a patient account.");
        }
        return null;
    }
}
