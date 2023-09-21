import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = "https://catfact.ninja/fact";

  constructor(private http: HttpClient) { }

  freeFact(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}`);
  }
}
