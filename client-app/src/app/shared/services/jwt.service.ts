import { Injectable } from "@angular/core";
@Injectable({ providedIn: "root" })
export class JWTService {
    setJWT(token: string): void {
        window.localStorage["token"] = token;
    }
    getJWT(): string {
        return window.localStorage["token"];
    }
    destroyJWT(): void {
        window.localStorage.removeItem("token");
    }
}