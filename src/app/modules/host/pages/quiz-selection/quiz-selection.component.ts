import {Component, OnInit, ViewContainerRef} from '@angular/core';
import { QuizService } from "@data/services/quiz.service";
import {Quiz} from "@data/interfaces/quiz.model";
import {Router} from "@angular/router";
import {Round} from "@data/interfaces/round.model";
import {ComponentPortal, Portal} from "@angular/cdk/portal";
import {WelcomePortalComponent} from "@modules/host/pages/welcome-portal/welcome-portal.component";
import {QuizCreationComponent} from "@modules/host/pages/quiz-creation/quiz-creation.component";
import {QuizPreviewComponent} from "@modules/host/pages/quiz-preview/quiz-preview.component";

@Component({
  selector: 'app-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.css']
})
export class QuizSelectionComponent implements OnInit {
  allQuizzes: Quiz[] = [];
  allRounds: Round[] = [];
  errorMsg : string = '';
  unexpectedErrorMsg : string = "An unexpected error occurred."
  selectedQuizId: number = -1;

  defaultPortal: ComponentPortal<WelcomePortalComponent> = new ComponentPortal(WelcomePortalComponent);
  quizCreationPortal: ComponentPortal<QuizCreationComponent> = new ComponentPortal(QuizCreationComponent);
  quizPreviewPortal: ComponentPortal<QuizPreviewComponent> = new ComponentPortal(QuizPreviewComponent);
  selectedPortal: Portal<any> = this.defaultPortal;

  constructor(private _quizService: QuizService, private _router: Router, private _viewContainerRef: ViewContainerRef) {}

  getHostQuizzes() {
    this._quizService.getAllQuizzes().subscribe((response: any): void => {
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        this.allQuizzes = response.body;
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }

  getAllRoundsByQuiz(quizId: string): void {
    this._quizService.getAllRoundsByQuiz(quizId).subscribe((response: any): void => {
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        this.allRounds = response.body;
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }

  ngOnInit() {
    this.getHostQuizzes();
  }

  redirect(quizId: number) {
    this._router.navigate([`host/preview/${quizId}`])
  }

  getPortalTitle(): string {
    switch(this.selectedPortal) {
      case this.defaultPortal: return "Welcome to *Game Title*!";
      case this.quizCreationPortal: return "Create a new Quiz:";
      case this.quizPreviewPortal: return "Preview for Quiz " + this.selectedQuizId + ":"
      default: return "Oops! No portal is selected :("
    }
  }

  setSelectedQuiz(quizId: number): void {
    this.selectedQuizId = quizId;
  }
}
