import { Component } from '@angular/core';
import { QuizService } from "@data/services/quiz.service";
import {Quiz} from "@data/interfaces/quiz.model";

@Component({
  selector: 'app-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.css']
})
export class QuizSelectionComponent {
  constructor(private quizService: QuizService) {
  }

  getHostQuizzes() {
    const allQuizzes = this.quizService.getAllQuiz();
    for (let i = 0; i < allQuizzes.length; i++) {
      const keys = Object.keys(allQuizzes[i]);
      const entry = allQuizzes[i];
      for (let j = 0; j < keys.length; j++) {
        console.log(keys[j]);
      }
    }
  }

}
