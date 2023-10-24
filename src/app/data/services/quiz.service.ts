import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {Quiz} from "@data/interfaces/quiz.model";
import {Host} from "@data/interfaces/host.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private baseUrl = environment.API_URL + "/Quiz"

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getAllQuizzes(): Observable<any> {
    const headers : HttpHeaders = new HttpHeaders ({
      'Authorization': "Bearer " + this.cookieService.get("token"),
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.baseUrl}/GetAllQuizzes`, { observe:'response', headers });
  }

  getAllRoundsByQuiz(quizId: string): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("token"),
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.baseUrl}/GetAllRoundsByQuiz?quizId=${quizId}`, {observe: 'response', headers});
  }

  getQuiz(quizId: string) {
    const headers = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("token"),
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.baseUrl}/GetQuiz/${quizId}`, { observe: 'response', headers });
  }
}
