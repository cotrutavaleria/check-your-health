import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JWTService } from "./jwt.service";
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
@Injectable({ providedIn: 'root' })
export class NewsService {
  constructor(private jwtService: JWTService, private httpClient: HttpClient, private router: Router, private message: MatSnackBar) { }

  public getArticles(token: string, language: string) {
    return this.httpClient.get<any>('http://localhost:8081/api/v1/news?language=' + language, {
      headers: {
        "X-AUTH-TOKEN": token
      }
    });
  }

}