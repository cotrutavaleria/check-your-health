import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JWTService } from "./jwt.service";
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
@Injectable({ providedIn: 'root' })
export class SearchService {
    constructor(private jwtService: JWTService, private httpClient: HttpClient, private router: Router, private message: MatSnackBar) { }

    public getDoctorsList(page: number, size: number,specialty: string,  name:string, location: string) {
        if(specialty == null){
            specialty = "";
        }
        if(location == null){
            location = "";
        }
        if(name == null){
            name = "";
        }
        console.log(name, specialty, location);
        let result = this.httpClient.get<any>('http://localhost:8081/api/v1/doctors/search?page=' + page + '&size=' + size + '&specialty=' + specialty + '&name=' + name + '&location=' + location);
        return result;
    }

    public getAllDoctors() {
        return this.httpClient.get<any>('http://localhost:8081/api/v1/doctors');
    }

    public getDoctorByUuid(uuid:string) {
        return this.httpClient.get<any>('http://localhost:8081/api/v1/doctors/' + uuid);
    }
   

}