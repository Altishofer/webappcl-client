import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParamsOptions} from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";
import { environment } from "../../../environments/environment";

import { Host } from '../interfaces/host.model'
import {Observable} from "rxjs";
import {VectorCalculationModel} from "@data/interfaces/VectorCalculation.model";
import {Round} from "@data/interfaces/round.model";
import {QuizWithRound} from "@data/interfaces/QuizWithRound";

@Injectable({
  providedIn: 'root',
})
export class HostService {
  private baseUrl : string = environment.API_URL + "/Host";
  private quizUrl : string = environment.API_URL + "/Quiz";

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getHosts(host: Host): void {
    const headers = new HttpHeaders({
      'Authorization': "bearer " + this.cookieService.get("hostToken"),
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
        'Bearer-Token':  this.cookieService.get("hostToken"),
        'Authorization': `bearer ${this.cookieService.get("hostToken")}`
      });
      return this.http.get(`${this.baseUrl}/RefreshToken`, { observe:'response', headers })
        .subscribe((response: any) => {
          if ((response.status >= 200 && response.status < 300) || response.status == 304) {
            this.cookieService.set('hostToken', response.body.result);
            console.log("TokenRefresh was successful: "+this.cookieService.get("hostName")+", received token: "+response.body.result);
          } else {
            console.log("ERROR: refreshing token was not successful");
          }
      });
    }, 15 * 60 * 1000); // Refresh every 15 minutes
  }

  getPlayers(quizId : string) : Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("hostToken"),
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.quizUrl}/GetPlayers/${quizId}`, { observe:'response', headers  });
  }

  getWaitResult(quizId : string, roundId:string) : Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("hostToken"),
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.quizUrl}/WaitResult/${quizId}/${roundId}`, { observe:'response', headers  });
  }

  getIntermediateResult(quizId : string, roundId:string) : Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("hostToken"),
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.quizUrl}/IntermediateResult/${quizId}/${roundId}`, { observe:'response', headers  });
  }

  getFinalResult(quizId : string) : Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("hostToken"),
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.quizUrl}/FinalResult/${quizId}`, { observe:'response', headers  });
  }

  pushRound(roundId : string) : Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("hostToken"),
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.quizUrl}/PushRound/${roundId}`, { observe:'response', headers  });
  }

  getRound(roundId : string) : Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': "bearer " + this.cookieService.get("hostToken"),
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.quizUrl}/GetRound/${roundId}`, { observe:'response', headers  });
  }

  getAllRoundsByQuiz(quizId: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("hostToken"),
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.baseUrl}/GetAllRoundsByQuiz?quizId=${quizId}`, {observe: 'response', headers});
  }

  getAllRoundIdsByQuiz(quizId: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("hostToken"),
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.quizUrl}/GetAllRoundIdsByQuiz/${quizId}`, {observe: 'response', headers});
  }

  wakeUpServer() : Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(`${environment.API_URL}/Word2Vector/status`, {observe: 'response', headers});
  }
}
