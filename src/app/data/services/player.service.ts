import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {Host} from "../interfaces/host.model";
import {Player} from "../interfaces/player.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private baseUrl = environment.API_URL + "/Player";
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getPlayer(player: Player): void {
    const headers = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("hostToken"),
      'Content-Type': 'application/json',
    });

    this.http.get(`${this.baseUrl}`, { headers }).subscribe((response: any) => {
      console.log("got player from request: " + response.playerName);
    });
  }

  register(player: Player): Observable<any> {
    const headers : HttpHeaders = new HttpHeaders ({
      'Content-Type': 'application/json',
    });
    const body : string = JSON.stringify(player);
    return this.http.post(`${this.baseUrl}/Register`, body, { observe:'response', headers });
  }
}
