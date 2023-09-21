import { Component, OnInit } from '@angular/core';
import { ApiService } from "./api.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'my-app';

  constructor(private service: ApiService) {}

  getFact() {
    this.service.freeFact().subscribe((results) => {
      console.log('Pineapples have been received - Result:\n', results);
    })
  }

  ngOnInit(): void {
  }
}
