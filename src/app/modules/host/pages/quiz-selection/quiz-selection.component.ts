import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { QuizService } from "@data/services/quiz.service";
import { Quiz } from "@data/interfaces/quiz.model";
import { Router } from "@angular/router";
import { Round } from "@data/interfaces/round.model";
import {ComponentPortal, Portal, TemplatePortal} from "@angular/cdk/portal";
import { WelcomePortalComponent } from "@app/modules/host/pages/welcome-portal/welcome-portal.component";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.css']
})
export class QuizSelectionComponent implements OnInit,AfterViewInit {
  allQuizzes: Quiz[] = [];
  allRounds: Round[] = [];
  errorMsg : string = '';
  unexpectedErrorMsg : string = "An unexpected error occurred."
  selectedQuizId: number;
  selectedQuizTitle: string;

  @ViewChild('quizPreviewContent') quizPreviewContent!: TemplateRef<unknown>;
  @ViewChild('quizCreationContent') quizCreationContent!: TemplateRef<unknown>;

  defaultPortal: ComponentPortal<WelcomePortalComponent> = new ComponentPortal(WelcomePortalComponent);
  quizCreationPortal!: TemplatePortal;
  quizPreviewPortal!: TemplatePortal;
  selectedPortal: Portal<any> = this.defaultPortal;

  constructor(private _quizService: QuizService, private _router: Router, private _viewContainerRef: ViewContainerRef, private _cookieService: CookieService) {
    this.selectedQuizId = -1;
    this.selectedQuizTitle = '';
  }

  ngOnInit() {
    this.getAllQuizzesByHost();
  }

  ngAfterViewInit() {
    this.quizCreationPortal = new TemplatePortal(this.quizCreationContent, this._viewContainerRef);
    this.quizPreviewPortal = new TemplatePortal(this.quizPreviewContent, this._viewContainerRef);
  }

  getAllRoundsByQuiz(quizId: number): void {
    this._quizService.getAllRoundsByQuiz(quizId).subscribe((response: any): void => {
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        this.allRounds = response.body;
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }

  //Todo: Change 'getAllQuizzes' to 'getAllQuizzesByHost'
  getAllQuizzesByHost(): Round[] {
    this._quizService.getAllQuizzes().subscribe((response: any): void => {
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        this.allQuizzes = response.body;
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
    return this.allRounds;
  }

  preloadRelevantRounds(): void {
    for (let pos = 0; pos < this.allQuizzes.length; pos++) {
      this.getAllRoundsByQuiz(this.allQuizzes[pos].id);
    }
  }

  getHostName(): string {
    return this._cookieService.get('hostName');
  }

  redirect(quizId: number) {
    this._router.navigate([`host/preview/${quizId}`]);
  }

  setSelectedQuiz(quizId: number, quizTitle: string): void {
    this.selectedQuizId = quizId;
    this.selectedQuizTitle = quizTitle;
  }

  closePortal() {
    this.selectedPortal = this.defaultPortal;
  }

  startQuiz() {
    console.log(`Theoretically starting quiz "${this.selectedQuizTitle}"...`)
  }

  saveChanges() {
    console.log(`Theoretically saving changes to quiz "${this.selectedQuizTitle}"...`)
  }

  saveCreation() {
    console.log(`Theoretically saving newly created quiz...`)
  }
}
