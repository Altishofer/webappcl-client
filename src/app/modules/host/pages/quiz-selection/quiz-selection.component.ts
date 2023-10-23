import {Component, inject, OnInit} from '@angular/core';
import { QuizService } from "@data/services/quiz.service";
import {Quiz} from "@data/interfaces/quiz.model";
import {Host} from "@data/interfaces/host.model";
import {catchError, Observable} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.css']
})
export class QuizSelectionComponent implements OnInit {
  allQuizzes: Quiz[] = [];
  errorMsg : string = '';
  unexpectedErrorMsg : string = "An unexpected error occurred."

  constructor(private quizService: QuizService) {

  }

  getHostQuizzes() {
    this.quizService.getAllQuizzes().subscribe((response: any): void => {
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        this.allQuizzes = response.body;
        //this.router.navigate(['/host']);
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }

  printArr() {
    console.log(this.allQuizzes);
  }

  ngOnInit() {
    this.getHostQuizzes();
  }
}
