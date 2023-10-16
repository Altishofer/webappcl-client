import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";
import { environment } from "../../../environments/environment";

import { Host } from '../interfaces/host.model'

@Injectable({
  providedIn: 'root',
})
export class HostService {
  private baseUrl = environment.API_URL + "/Host";
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getHosts(host: Host): void {
    const headers = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("token"),
      'Content-Type': 'application/json',
    });

    this.http.get(`${this.baseUrl}/GetHosts`, { headers }).subscribe((response: any) => {
      console.log("got hostName from request: " + response.hostName);
    });
  }

  register(host: Host): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = JSON.stringify(host);

    this.http.post(`${this.baseUrl}/Register`, body, { headers }).subscribe((response: any) => {
      this.cookieService.set('token', response.token);
      this.cookieService.set('hostName', host.hostName);
      console.log("Registration was successful: "+host.hostName+", received token: "+response.token);
      this.refreshTokenPeriodically();
    });
  }

  login(host: Host): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`${this.baseUrl}/Login`, JSON.stringify(host), { headers }).subscribe((response: any) => {
      this.cookieService.set('token', response.token);
      this.cookieService.set('hostName', host.hostName);
      console.log("Login was successful: "+host.hostName+", received token: "+response.token);
      this.refreshTokenPeriodically();
    });
  }

  refreshTokenPeriodically() {
    setInterval(() => {
      this.http.get(`${this.baseUrl}/RefreshToken`).subscribe((response: any) => {
        this.cookieService.set('token', response.token);
        console.log("TokenRefresh was successful: "+this.cookieService.get("hostName")+", received token: "+response.token);
      });
    }, 15 * 60 * 1000); // Refresh every 15 minutes
  }
}
