import {ChangeDetectorRef, Component} from '@angular/core';
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {Round} from "@data/interfaces/round.model";
import {VectorCalculationModel} from "@data/interfaces/VectorCalculation.model";
import {Answer} from "@data/interfaces/answer.model";
import {SignalRService} from "@data/services/SignalRService";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {HostService} from "@data/services/host.service";
import {WaitResult} from "@data/interfaces/WaitResult.model";

@Component({
  selector: 'app-round-main',
  templateUrl: './round-main.component.html',
  styleUrls: ['./round-main.component.css']
})
export class RoundMainComponent {
  quizId : string = '';
  roundId : string = '';
  playerName : string = '';
  unexpectedErrorMsg : string = "An unexpected error occurred."
  errorMsg : string = '';

  waitResult : WaitResult = {
    notAnsweredPlayerName : [],
    answeredPlayerName : []
  }

  round : Round = {
    id: "",
    quizId: "",
    roundTarget: "",
    forbiddenWords: []
  };

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private signalRService: SignalRService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private hostService: HostService
  ) {
    this.route.params.subscribe(params => {
      this.quizId = params['quizId'];
      this.roundId = params['roundId'];
    });
  }

  print(){
    console.log(this.round);
    console.log(this.round.forbiddenWords);
  }

  ngOnInit(): void {
    this.getRound();
    this.signalRService.startConnection().then(() => {
      this.registerToGroup();
      this.registerListeners();
    }).catch(error => {
      console.error("SignalR connection error:", error);
    });
    this.getWaitResult();
  }

  getRound(): void {
    this.hostService.getRound(this.roundId).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(JSON.stringify(error.error));
        if (error.status != 500) {
          this.errorMsg = error.error;
        } else {
          this.errorMsg = this.unexpectedErrorMsg;
        }
        return[];
      })
    ).subscribe((response: any): void => {
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        console.log(response.body)
        this.round = response.body;
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }

  switchToRanking(): void {
    this.router.navigate(['/host', 'result', this.quizId, this.roundId]);
  }

  registerToGroup() {
    console.log("SOCKET: registerToGroup", this.quizId);
    this.signalRService.joinGroup(this.quizId);
  }

  registerListeners(): void {
    this.signalRService.setReceiveWaitResultListener((waitResult: WaitResult) => {
      console.log("SOCKET waitResult: ", waitResult)
      this.waitResult = waitResult;
    });
  }

  switchToResults(): void {
    this.router.navigate(['/host', 'results', this.quizId, this.roundId]);
  }


  get answeredPercentage() {
    return Math.round(this.waitResult.answeredPlayerName.length / (this.waitResult.notAnsweredPlayerName.length + this.waitResult.answeredPlayerName.length) * 100);
  }

  get unansweredPercentage() {
    return Math.round(100 - this.answeredPercentage);
  }

  getWaitResult(): void {
    console.log("REST: getWaitResult", this.quizId, this.roundId);
    this.hostService.getWaitResult(this.quizId, this.roundId).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(JSON.stringify(error.error));
        if (error.status != 500) {
          this.errorMsg = error.error;
        } else {
          this.errorMsg = this.unexpectedErrorMsg;
        }
        return[];
      })
    ).subscribe((response: any): void => {
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        console.log(response.body)
        this.errorMsg = '';
        this.waitResult = response.body;
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }

}
