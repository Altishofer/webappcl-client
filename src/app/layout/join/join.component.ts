import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent {
  errorMsg : string = '';
  playerJoinForm: FormGroup;
  unexpectedErrorMsg : string = "An unexpected error occurred."
  quizId: string = '';
  constructor(
    private router: Router,
    private fb: FormBuilder) {
    this.playerJoinForm = this.fb.group({
      quizId: ['', [Validators.required, Validators.pattern(/^(\S){1,50}$/)]]});
  };

  doRedirect(): void {
    this.router.navigate(['player', 'register', this.playerJoinForm.value.quizId]);
  }
}
