import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";
import { environment } from "../../../environments/environment";

import { Host } from '../interfaces/host.model'
import {Observable} from "rxjs";

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

  register(host: Host): Observable<any> {
    const headers : HttpHeaders = new HttpHeaders ({
      'Content-Type': 'application/json',
    });
    const body : string = JSON.stringify(host);
    return this.http.post(`${this.baseUrl}/Register`, body, { headers });
  }

  login(host: Host): Observable<any> {
    const headers : HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body : string = JSON.stringify(host);
    return this.http.post(`${this.baseUrl}/Login`, body, { headers });
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
