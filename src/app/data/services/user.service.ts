import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { User } from '../interfaces/user.model'


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:5072/api/User';

  constructor(private http: HttpClient) {}

  getUser(user: User, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': token,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.baseUrl}/GetUser`, { headers });
  }

  register(user: User): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = JSON.stringify(user);
    const response = this.http.post(`${this.baseUrl}/Register`, body, { headers });
    console.log(response.subscribe(answer => console.log(answer)));
    return response;
  }

  login(user: User): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.baseUrl}/Login`, JSON.stringify(user), { headers });
  }
}
