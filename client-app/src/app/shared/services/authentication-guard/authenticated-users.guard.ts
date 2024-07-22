import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { UserService } from "../user.service";
import { JWTService } from "../jwt.service";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";

@Injectable({
    providedIn: 'root'
})
class AuthenticatedUserGuard {

    constructor(private httpClient: HttpClient, private router: Router, private authentication: UserService, private jwtService: JWTService) { }

    isAuthenticated(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> {
        const token = this.jwtService.getJWT();
        if (token) {
            if (state.url === '/auth/login' || state.url === '/auth/signup' || state.url.includes('/auth/reset-password')) {
                return this.router.parseUrl('/not-found');
            }
            return this.parseRoutesWhenAuthenticated(token, state);
        } else {
            return this.parseRoutesWhenNotAuthenticated(state);
        }
    }

    parseRoutesWhenAuthenticated(token: string, state: RouterStateSnapshot) {
        return this.httpClient.get<any>('http://localhost:8081/api/v1/users', {
            headers: {
                "X-AUTH-TOKEN": token
            }
        })
            .pipe(
                map((result: any) => {
                    if (result != null) {
                        if (state.url === '/home') {
                            if (result.userType === "ADMINISTRATOR") {
                                return this.router.parseUrl('/home/admin');
                            }
                            return true;
                        } else if (state.url === '/home/admin') {
                            if (result.userType === "ADMINISTRATOR") {
                                return true;
                            }
                            return this.router.parseUrl('/not-found');
                        } else if (state.url === '/settings/other-settings' || state.url === '/schedule') {
                            if (result.userType === "DOCTOR") {
                                return true;
                            }
                            return this.router.parseUrl('/not-found');
                        } else if (state.url === '/settings/profile' || state.url === '/appointments' || state.url === '/notifications' || state.url === "/help") {
                            if (result.userType === "DOCTOR" || result.userType === "PATIENT") {
                                return true;
                            }
                            return this.router.parseUrl('/not-found');
                        } else if (state.url.includes("/search") || state.url.includes("/doctor") || state.url.includes("/symptom-checker")) {
                            if (result.userType === "PATIENT") {
                                return true;
                            }
                            return this.router.parseUrl('/not-found');
                        } else {
                            return true;
                        }
                    }
                    return this.router.parseUrl('/not-found');
                })
            );
    }

    parseRoutesWhenNotAuthenticated(state: RouterStateSnapshot) {
        if (state.url === '/auth/login' || state.url === '/auth/signup' || state.url.includes('/auth/reset-password') || state.url.includes("/home")) {
            return true;
        }
        if (state.url.includes('/search') || state.url.includes('/doctor')) {
            return true;
        }
        if (state.url === '/home/admin') {
            return this.router.parseUrl('/not-found');
        }
        if (state.url === '/settings/other-settings' || state.url === '/settings/profile') {
            return this.router.parseUrl('/not-found');
        }
        if (state.url === '/appointments' || state.url === '/schedule' || state.url === '/notifications') {
            return this.router.parseUrl('/not-found');
        }
        if (state.url === '/symptom-checker') {
            return true;
        }
        return false;
    }
}
export const isAuthenticated: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> => {
    return inject(AuthenticatedUserGuard).isAuthenticated(next, state);
}