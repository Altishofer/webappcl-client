import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";
import { environment } from "../../../environments/environment";

import { User } from '../interfaces/user.model'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.API_URL + "/User";
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getUser(user: User): void {
    const headers = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("token"),
      'Content-Type': 'application/json',
    });

    this.http.get(`${this.baseUrl}/GetUser`, { headers }).subscribe((response: any) => {
      console.log("got username from request: " + response.userName);
    });
  }

  register(user: User): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = JSON.stringify(user);

    this.http.post(`${this.baseUrl}/Register`, body, { headers }).subscribe((response: any) => {
      this.cookieService.set('token', response.token);
      this.cookieService.set('userName', user.userName);
      console.log("Registration was successful: "+user.userName+", received token: "+response.token);
      this.refreshTokenPeriodically();
    });
  }

  login(user: User): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${this.baseUrl}/Login`, JSON.stringify(user), { headers }).subscribe((response: any) => {
      this.cookieService.set('token', response.token);
      this.cookieService.set('userName', user.userName);
      console.log("Login was successful: "+user.userName+", received token: "+response.token);
      this.refreshTokenPeriodically();
    });
  }

  refreshTokenPeriodically() {
    setInterval(() => {
      this.http.get(`${this.baseUrl}/RefreshToken`).subscribe((response: any) => {
        this.cookieService.set('token', response.token);
        console.log("TokenRefresh was successful: "+this.cookieService.get("userName")+", received token: "+response.token);
      });
    }, 15 * 60 * 1000); // Refresh every 15 minutes
  }
}
