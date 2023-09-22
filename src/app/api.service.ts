import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = "https://catfact.ninja/fact";

  constructor(private http: HttpClient) { }

  getFact() {
    return this.http.get(this.apiUrl);
  }
}
