import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { QuizService } from "@data/services/quiz.service";
import {ActivatedRoute, Router} from "@angular/router";
import { Round } from "@data/interfaces/round.model";
import {ComponentPortal, Portal, TemplatePortal} from "@angular/cdk/portal";
import { WelcomePortalComponent } from "@app/modules/host/pages/welcome-portal/welcome-portal.component";
import {CookieService} from "ngx-cookie-service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {ClickMode, Container, Engine, HoverMode, MoveDirection, OutMode} from "tsparticles-engine";
import {loadSlim} from "tsparticles-slim";

@Component({
  selector: 'app-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.css']
})
export class QuizSelectionComponent implements OnInit,AfterViewInit {
  allQuizzes!: [{hostId: number, quizId: number, title: string, rounds: Round[]}];
  allRoundsOfQuiz: Round[] = [];
  errorMsg : string = '';
  unexpectedErrorMsg : string = "An unexpected error occurred.";
  selectedQuizId: number = -1;
  selectedQuizTitle: string = "";
  selectedQuizHostId: number = -1;
  hostId!: number;
  tooltipMessage: string = "This word is not valid, please enter a different one."

  @ViewChild('quizPreviewContent') quizPreviewContent!: TemplateRef<unknown>;

  defaultPortal: ComponentPortal<WelcomePortalComponent> = new ComponentPortal(WelcomePortalComponent);
  quizPreviewPortal!: TemplatePortal;
  selectedPortal: Portal<any> = this.defaultPortal;

  constructor(
      private _quizService: QuizService,
      private _router: Router,
      private _viewContainerRef: ViewContainerRef,
      private _cookieService: CookieService,
      private router: Router,
      private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.hostId = Number(params['hostId']);
    });
  }

  ngOnInit() {
    this.getQuizzesWithRounds();
  }

  ngAfterViewInit() {
    this.quizPreviewPortal = new TemplatePortal(this.quizPreviewContent, this._viewContainerRef);
  }

  getQuizzesWithRounds(): void {
    this._quizService.getQuizzesWithRounds()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(JSON.stringify(error.error));
          if (error.status != 500) {
            this.errorMsg = error.error;
          } else {
            this.errorMsg = this.unexpectedErrorMsg;
          }
          return[];
        })
      )
      .subscribe((response: any): void => {
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        this.allQuizzes = response.body;
        this.allQuizzes.push({hostId: this.hostId, quizId: -1, title: "New quiz", rounds: [{id:"-1", roundTarget:"", quizId: "-1", forbiddenWords:[""]}]});
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }

  getHostName(): string {
    return this._cookieService.get('hostName');
  }

  redirect(quizId: number) {
    this._router.navigate(["host", this.hostId, "preview",  quizId]);
  }

  setSelectedQuiz(quizId: number, quizTitle: string, hostId : number): void {
    this.selectedQuizId = quizId;
    this.selectedQuizTitle = quizTitle;
    this.selectedQuizHostId = hostId;
  }

  getSelectedQuizRounds(requestedQuizId: number): Round[] {
    for (let pos: number = 0; pos < this.allQuizzes.length; pos++) {
      if (this.allQuizzes[pos].quizId === requestedQuizId) {
        this.allRoundsOfQuiz = this.allQuizzes[pos].rounds;
        return this.allRoundsOfQuiz;
      }
    }
    return [];
  }

  closePortal() {
    this.selectedQuizId = -1;
    this.selectedQuizTitle = "";
    this.selectedQuizHostId = -1;
    this.allRoundsOfQuiz = [];
    this.selectedPortal = this.defaultPortal;
  }

  refresh(){
    this.closePortal();
    this.getQuizzesWithRounds();
    this.ngAfterViewInit();
  }

  startQuiz() {
    this.router.navigate(['/host', this.hostId, 'lobby', this.selectedQuizId]);
  }

  saveCreation() {
    console.log(`Theoretically saving newly created quiz...`);
  }

  doLogout() {
    this._cookieService.delete('token');
    localStorage.removeItem('hostName');
    localStorage.removeItem('hostId');
    this.router.navigate(['/host']);
  }


  //tsParticles definition
  id = "tsparticles-overlay";

  particlesOptions = {
    background: {
      opacity: 0
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: false,
          mode: ClickMode.push,
        },
        onHover: {
          enable: true,
          mode: HoverMode.repulse,
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff"
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        direction: MoveDirection.none,
        enable: true,
        outModes: {
          default: OutMode.bounce,
        },
        random: true,
        speed: {min: 1, max: 6},
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 50,
      },
      opacity: {
        value: 0.4,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  };

  particlesLoaded(container: Container): void {
    console.log("particle container loaded.");
  }

  async particlesInit(engine: Engine): Promise<void> {
    console.log("particle engine loaded.");
    await loadSlim(engine);
  }
}
