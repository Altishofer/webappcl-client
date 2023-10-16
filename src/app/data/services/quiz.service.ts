import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {Quiz} from "@data/interfaces/quiz.model";

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private baseUrl = environment.API_URL + "/Quiz"
  public allQuizzes: Quiz[] = [];

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getAllQuizzes(): Quiz[] {

    const headers = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("token"),
      'Content-Type': 'application/json',
    });

    this.http.get(`${this.baseUrl}/GetAllQuizzes`, { headers }).subscribe((response: any) => {
      this.allQuizzes = <Quiz[]> response;
    });
    return this.allQuizzes;
  }


  getQuiz(quizId: number) {
    const headers = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("token"),
      'Content-Type': 'application/json',
    });

    this.http.get(`${this.baseUrl}/GetQuiz/${quizId}`, { headers }).subscribe((response: any) => { //Todo: Replace fixed ID with dynamic solution
      console.log("got quizzes from request: " + response);
    });
  }
}
