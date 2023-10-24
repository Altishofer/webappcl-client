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
  private playerUrl = environment.API_URL + "/Player";
  private quizUrl = environment.API_URL + "/Quiz";

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getPlayer(player: Player): void {
    const headers = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("hostToken"),
      'Content-Type': 'application/json',
    });

    this.http.get(`${this.playerUrl}`, { headers }).subscribe((response: any) => {
      console.log("got player from request: " + response.playerName);
    });
  }

  register(player: Player): Observable<any> {
    const headers : HttpHeaders = new HttpHeaders ({
      'Content-Type': 'application/json',
    });
    const body : string = JSON.stringify(player);
    return this.http.post(`${this.playerUrl}/Register`, body, { observe:'response', headers });
  }

  getPlayers(quizId : string) : Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("hostToken"),
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.quizUrl}/GetPlayers/${quizId}`, { observe:'response', headers  });
  }
}
