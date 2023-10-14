import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {Host} from "../interfaces/host.model";
import {Player} from "../interfaces/player.model";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private baseUrl = environment.API_URL + "/Player";
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getPlayer(host: Host): void {
    const headers = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("token"),
      'Content-Type': 'application/json',
    });

    this.http.get(`${this.baseUrl}`, { headers }).subscribe((response: any) => {
      console.log("got player from request: " + response.playerName);
    });
  }

  register(player: Player): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = JSON.stringify(player);

    this.http.post(`${this.baseUrl}/Register`, body, { headers }).subscribe((response: any) => {
      this.cookieService.set('token', response.token);
      this.cookieService.set('playerName', player.playerName);
      console.log("Registration was successful: "+player.playerName+", received token: "+response.token);
      /*this.refreshTokenPeriodically();*/
    });
  }
}
