import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {Quiz} from "@data/interfaces/quiz.model";
import {Host} from "@data/interfaces/host.model";
import {Observable} from "rxjs";
import {QuizWithRound} from "@data/interfaces/QuizWithRound";

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private baseUrl = environment.API_URL + "/Quiz"

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  // ToDo: remove debug method
  getAllQuizzes(): Observable<any> {
    const headers : HttpHeaders = new HttpHeaders ({
      'Authorization': "Bearer " + this.cookieService.get("hostToken"),
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.baseUrl}/GetAllQuizzes`, { observe:'response', headers });
  }

  getAllQuizzesByHost(): Observable<any> {
    const headers : HttpHeaders = new HttpHeaders ({
      'Authorization': "Bearer " + this.cookieService.get("hostToken"),
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.baseUrl}/GetAllQuizzesByHost`, { observe:'response', headers });
  }

  getAllRoundsByQuiz(quizId: number): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("hostToken"),
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.baseUrl}/GetAllRoundsByQuiz?quizId=${quizId}`, {observe: 'response', headers});
  }

  getQuizzesWithRounds(): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("hostToken"),
      'Content-Type': 'application/json',
    });
    return this.http.get(`${this.baseUrl}/GetQuizzesWithRounds`, {observe: 'response', headers});
  }

  // ToDo: remove debug method
  getQuiz(quizId: number) {
    const headers = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("hostToken"),
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.baseUrl}/GetQuiz/${quizId}`, { observe: 'response', headers });
  }

  updateQuiz(quizRoundDto : QuizWithRound): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("hostToken"),
      'Content-Type': 'application/json',
    });
    let body : any = JSON.stringify(quizRoundDto);
    return this.http.put(`${this.baseUrl}/UpdateQuiz`, body, {observe: 'response', headers});
  }

  createQuiz(quizRoundDto : QuizWithRound): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("hostToken"),
      'Content-Type': 'application/json',
    });
    let body : any = JSON.stringify(quizRoundDto);
    return this.http.post(`${this.baseUrl}/CreateQuizWithRounds`, body, {observe: 'response', headers});
  }
}
