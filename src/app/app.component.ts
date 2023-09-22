import { Component, OnInit } from '@angular/core';
import { ApiService } from "./api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Get Fact';
  currentFact = "Cats can have multiple colours";

  constructor(private service: ApiService) {}

  freeFact() {
    this.service.getFact()
      .subscribe((results) => {
        const factString = Object.values(results);
        this.currentFact = factString[0];
    });
    return this.currentFact;
  }

  ngOnInit(): void {
    this.freeFact();
  }
}
