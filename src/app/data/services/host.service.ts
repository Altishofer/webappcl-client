import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParamsOptions} from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";
import { environment } from "../../../environments/environment";

import { Host } from '../interfaces/host.model'
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class HostService {
  private baseUrl : string = environment.API_URL + "/Host";
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
    return this.http.post(`${this.baseUrl}/Register`, body, { observe:'response', headers });
  }

  login(host: Host): Observable<any> {
    const headers : HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body : string = JSON.stringify(host);
    return this.http.post(`${this.baseUrl}/Login`, body, { observe:'response', headers });
  }

  refreshTokenPeriodically() {
    setInterval(() => {
      const headers : HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      return this.http.get(`${this.baseUrl}/RefreshToken`, { observe:'response', headers })
        .subscribe((response: any) => {
          if ((response.status >= 200 && response.status < 300) || response.status == 304) {
            this.cookieService.set('token', response.body.result);
            console.log("TokenRefresh was successful: "+this.cookieService.get("hostName")+", received token: "+response.body.result);
          } else {
            console.log("ERROR: refreshing token was not successful");
          }
      });
    }, 15 * 60 * 1000); // Refresh every 15 minutes
  }
}
