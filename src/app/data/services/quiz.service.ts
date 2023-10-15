import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private baseUrl = environment.API_URL + "/Quiz"

  placeholderJSON: Array<JSON> =
    [
      JSON.parse('{"Id": 1, "HostId": 69, "Title": "Example One Hardcoded"}'),
      JSON.parse('{"Id": 2, "HostId": 69, "Title": "Example Two Hardcoded"}'),
      JSON.parse('{"Id": 3, "HostId": 69, "Title": "Example Three Hardcoded"}')
    ];

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getAllQuiz() {
    return this.placeholderJSON
    /*const headers = new HttpHeaders({
      'Authorization': "Bearer " + this.cookieService.get("token"),
      'Content-Type': 'application/json',
    });

    this.http.get(`${this.baseUrl}/GetAllQuiz`, { headers }).subscribe((response: any) => {
      console.log("got quizzes from request: " + response.quizzes);
    });*/
  }
}
