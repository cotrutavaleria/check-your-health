import { HttpClient } from "@angular/common/http";
import { Injectable, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router, UrlSegment } from "@angular/router";
import { JWTService } from "./jwt.service";
import { FormGroup } from "@angular/forms";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InfoDialogPatientComponent } from "src/app/shared/other-resources/info-dialog-patient/info-dialog-patient.component";
import { InfoDialogDoctorComponent } from "src/app/shared/other-resources/dialogs/info-dialog-doctor/info-dialog-doctor.component";
import { InfoDialogPatientAccountActivatedComponent } from "src/app/shared/other-resources/dialogs/info-dialog-patient-account-activated/info-dialog-patient-account-activated.component";
import { tap, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    user = { userType: '', userFullName: '', isAuthenticated: false };
    public loginSuccess: EventEmitter<string> = new EventEmitter();
    private userSubject = new BehaviorSubject<any>(null);
    constructor(private message: MatSnackBar,
        private jwtService: JWTService,
        public dialog: MatDialog,
        private httpClient: HttpClient,
        private router: Router,
        private route: ActivatedRoute) {

    }

    public login(user: { emailAddress: string, password: string }, form: FormGroup) {
        this.httpClient.post<any>('http://localhost:8081/api/v1/users/login', user).pipe(
            tap((result: any) => {
                if (result != null) {
                    console.log(result);
                    this.jwtService.setJWT(result.token);
                    this.updateNavbar(result.token).subscribe(() => {
                        this.loginSuccess.emit(result.token); // Emit the login success event with the token
                        this.getUserInfo().subscribe((userInfo) => {
                            this.user = userInfo;
                            console.log('herrrr', this.user);
                            if (this.user.userType === 'A') {
                                this.router.navigateByUrl('/home/admin');
                            } else {
                                this.router.navigateByUrl('/home');
                            }
                        });

                    });
                }
            })
        ).subscribe(
            () => { },
            (error) => {
                if (error.status == 403) {
                    form.setErrors({ 'FORBIDDEN': true });
                } else if (error.status == 404) {
                    form.setErrors({ 'NOT_FOUND': true });
                }
            }
        );
    }

    public updateNavbar(tokenInfo: string): Observable<any> {
        return new Observable<any>((observer) => {
            let userType = '';
            let userFullName = '';
            let isAuthenticated = false;
            if (tokenInfo) {
                this.getUserInformation(tokenInfo).subscribe((result: any) => {
                    if (result != null) {
                        console.log(result);
                        if (result.userType === "PATIENT") {
                            userType = 'P';
                            userFullName = result.fullName;
                        } else if (result.userType === "ADMINISTRATOR") {
                            userType = 'A';
                            userFullName = result.username;
                        } else {
                            userFullName = result.fullName;
                            userType = 'D';
                        }
                        isAuthenticated = true;
                        const user = { userType: userType, userFullName: userFullName, isAuthenticated: isAuthenticated };
                        this.userSubject.next(user); // Update the BehaviorSubject with new user info
                        observer.next(user);
                        observer.complete();
                    } else {
                        observer.error(new Error('Failed to update navbar'));
                    }
                }, (error: any) => {
                    if (error.status == 401 || error.status == 500) {
                        this.logout();
                    }
                    observer.error(error);
                });
            } else {
                observer.error(new Error('Token info is missing'));
            }
        });
    }


    getToken(): string {
        return this.jwtService.getJWT();
    }

    getUserInfo(): Observable<any> {
        return this.userSubject.asObservable();
    }

    public logout() {
        this.jwtService.destroyJWT();
        this.router.navigateByUrl('/auth/login');
    }

    public signupPatient(user: { fullName: string, gender: string, birthdate: string, emailAddress: string, phoneNumber: string, password: string, passwordConfirmation: string }, form: FormGroup) {
        this.httpClient.post<any>('http://localhost:8081/api/v1/patients/signup', user).subscribe(
            (result: any) => {
                if (result != null) {
                    const dialogContent = this.dialog.open(InfoDialogPatientComponent);
                }
            },
            (error) => {
                if (error.status == 409) {
                    form.setErrors({ 'CONFLICT': true });
                }
            }
        );
    }

    public signupDoctor(user: { specialty: string, workAddress: string, fullName: string, gender: string, birthdate: string, emailAddress: string, phoneNumber: string, password: string, passwordConfirmation: string }, form: FormGroup) {
        this.httpClient.post<any>('http://localhost:8081/api/v1/doctors/signup', user).subscribe(
            (result: any) => {
                const dialogContent = this.dialog.open(InfoDialogDoctorComponent);
            },
            (error) => {
                if (error.status == 409) {
                    form.setErrors({ 'CONFLICT': true });
                }
            }
        );
    }

    public activateToken(token: string): void {
        let message = "";
        let existentToken = this.jwtService.getJWT();
        if (existentToken != null) {
            this.router.navigateByUrl("/home");
            this.openSnackBar("You are already connected!");
        } else {
            this.httpClient.put<any>('http://localhost:8081/api/v1/patients/activated', [], {
                headers: {
                    "X-AUTH-TOKEN": token
                }
            }).subscribe(
                (result: any) => {
                    if (result != null) {
                        localStorage.clear();
                        this.jwtService.setJWT(result.token);
                        this.router.navigateByUrl("/home");
                        if (localStorage.getItem("language") == " ro") {
                            message = "Contul tău este acum activat. Sunteți autentificat!";
                        } else {
                            message = "Your account is now enabled. You are logged in!";
                        }
                        const dialogContent = this.dialog.open(InfoDialogPatientAccountActivatedComponent, { data: { message: message } });
                        dialogContent.afterClosed().subscribe(response => {
                            this.router.navigateByUrl("/home");
                            window.location.reload();
                        });
                    }
                },
                (error) => {
                    if (error.status == 401) {
                        if (localStorage.getItem("language") == " ro") {
                            message= "Tokenul tău a expirat sau nu există! Vă rog, înregistrați-vă din nou!";
                        }else{
                            message = "Your token is expired or does not exist! Please, register again!";
                        }
                        const dialogContent = this.dialog.open(InfoDialogPatientAccountActivatedComponent, { data: { message: message } });
                        dialogContent.afterClosed().subscribe(response => {
                            this.router.navigateByUrl("/home");
                            window.location.reload();
                        });
                    }
                    if (error.status == 409) {
                        if(localStorage.getItem("language") =="ro"){
                            message = "Contul dvs. este deja activ! Vă puteți conecta.";
                        }else{
                            message = "Your account is already active! You may sign in.";
                        }
                        const dialogContent = this.dialog.open(InfoDialogPatientAccountActivatedComponent, { data: { message: message } });
                        dialogContent.afterClosed().subscribe(response => {
                            this.router.navigateByUrl("/home");
                            window.location.reload();
                        });
                    }

                }
            );
        }
    }

    public resetPasswordSendEmail(emailAddress: string, form: FormGroup) {
        this.httpClient.post<any>('http://localhost:8081/api/v1/users/password-reset-emails/' + emailAddress, emailAddress).subscribe(
            (result: any) => {
                this.router.navigateByUrl("/home");
            },
            (error) => {
                if (error.status == 404) {
                    form.setErrors({ 'NOT_FOUND': true });
                } else if (error.status === 500) {
                    form.setErrors({ "INTERNAL_SERVER_ERROR": true });
                } else if (error.status == 403) {
                    form.setErrors({ 'FORBIDDEN': true });
                }
            }
        );
    }

    public resetPasswordAccepted(user: { token: string, password: string }, form: FormGroup): void {
        this.httpClient.put<any>('http://localhost:8081/api/v1/users/password-reset-responses', user).subscribe(
            (result: any) => {
                localStorage.clear();
                this.router.navigateByUrl("/auth/login");
            },
            (error) => {
                if (error.status == 401) {
                    form.setErrors({ 'UNAUTHORIZED': true });
                }
            }
        );
    }

    public getUserInformation(token: string) {
        return this.httpClient.get<any>('http://localhost:8081/api/v1/users', {
            headers: {
                "X-AUTH-TOKEN": token
            }
        });
    }

    public updatePatientInformation(patient: { fullName: string, emailAddress: string, birthdate: string, gender: string, phoneNumber: string }, token: string, form: FormGroup) {
        this.httpClient.put<any>('http://localhost:8081/api/v1/patients', patient, {
            headers: {
                "X-AUTH-TOKEN": token
            }
        }).subscribe(
            (result: any) => {
                console.log(result);
                this.jwtService.setJWT(result.token);
                this.openSnackBar("Your profile has been updated!");

            },
            (error) => {
                if (error.status == 403) {
                    form.setErrors({ 'FORBIDDEN': true });
                    this.openSnackBar("The e-mail address is already taken! Have a look on it!");

                }
                if (error.status == 409) {
                    form.setErrors({ 'CONFLICT': true });
                }
                if (error.status == 500) {
                    form.setErrors({ 'INTERNAL_SERVER_ERROR': true });
                    this.openSnackBar("An error has encountered! Please, reload your page and try again.");
                }
            }
        );
    }
    public updateDoctorInformation(doctor: { fullName: string, emailAddress: string, birthdate: string, gender: string, phoneNumber: string }, token: string, form: FormGroup) {
        this.httpClient.put<any>(
            'http://localhost:8081/api/v1/doctors',
            doctor,
            {
                headers: {
                    "X-AUTH-TOKEN": token
                }
            }).subscribe(
                (result: any) => {
                    console.log(result);
                    this.jwtService.destroyJWT();
                    this.jwtService.setJWT(result.token);
                    this.openSnackBar("Your profile has been updated!");
                },
                (error) => {
                    if (error.status == 403) {
                        form.setErrors({ 'FORBIDDEN': true });
                        this.openSnackBar("The e-mail address is already taken! Have a look on it!");
                    }
                    // if (error.status == 409) {
                    //     form.setErrors({ 'CONFLICT': true });
                    //     this.openSnackBar("Your session has expired! Please, authenticate again!");
                    // }
                    if (error.status == 500) {
                        form.setErrors({ 'INTERNAL_SERVER_ERROR': true });
                        this.openSnackBar("An error has encountered! Please, reload your page and try again.");
                    }
                }
            );
    }

    public updateAdditionalInformation(doctor: { workAddress: string, additionalDoctorInformation: Array<string> }, token: string, form: FormGroup) {
        console.log(doctor);
        this.httpClient.put<any>('http://localhost:8081/api/v1/doctors/work-settings', doctor, {
            headers: {
                "X-AUTH-TOKEN": token
            }
        }).subscribe(
            (result: any) => {
                console.log(result);
                this.jwtService.setJWT(result.token);
                this.openSnackBar("Your profile has been updated!");
            },
            (error) => {
                if (error.status == 500) {
                    console.log(error);
                    form.setErrors({ 'INTERNAL_SERVER_ERROR': true });
                    this.openSnackBar("An error has encountered! Please, reload your page and try again.");
                }
            }
        );
    }

    public getAllSpecialties() {
        return this.httpClient.get<any>('http://localhost:8081/api/v1/doctors/specialties');
    }

    public getDoctorsByName(name: string) {
        return this.httpClient.get<any>('http://localhost:8081/api/v1/doctors/' + name);
    }

    public sendContactUsMail(contactUs) {
        this.httpClient.post<any>('http://localhost:8081/api/v1/notifications/contact-us', contactUs).subscribe(
            (result: any) => {
                this.openSnackBar("We have received your request, you will be contacted by someone as soon as possible.");
                this.router.navigateByUrl("/home");
            },
            (error) => {
                if (error.status == 404) {
                } else if (error.status === 500) {
                    this.openSnackBar("An error has encountered! Please, reload your page and try again.");
                }
            }
        );
    }

    openSnackBar(message: string) {
        this.message.open(message, "Close", {
            duration: 3000,
        });
    }
}
