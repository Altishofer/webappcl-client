import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {Player} from "../interfaces/player.model";
import {Observable} from "rxjs";
import {Answer} from "@data/interfaces/answer.model";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playerUrl = environment.API_URL + "/Player";
  private quizUrl = environment.API_URL + "/Quiz";

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  sendAnswer(answer: Answer): Observable<any> {
    const headers : HttpHeaders = new HttpHeaders ({
      'Authorization': "Bearer " + this.cookieService.get("playerToken"),
      'Content-Type': 'application/json',
    });
    const body : string = JSON.stringify(answer);
    console.log(body);
    return this.http.post(`${this.quizUrl}/CreateAnswer`, body, { observe:'response', headers });
  }

  register(player: Player): Observable<any> {
    const headers : HttpHeaders = new HttpHeaders ({
      'Content-Type': 'application/json',
    });
    const body : string = JSON.stringify(player);
    return this.http.post(`${this.playerUrl}/Register`, body, { observe:'response', headers });
  }
}
