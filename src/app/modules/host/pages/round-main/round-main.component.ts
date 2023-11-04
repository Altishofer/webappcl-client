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
  hostId : string = '';
  remainingTime = 25;


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
    private signalRService: SignalRService,
    private router: Router,
    private route: ActivatedRoute,
    private hostService: HostService,
    private cdr: ChangeDetectorRef,
  ) {
    this.route.params.subscribe(params => {
      this.quizId = params['quizId'];
      this.roundId = params['roundId'];
      this.hostId = params['hostId'];
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
    this.startTimer();
  }

  startTimer() {
    if (this.remainingTime > 0) {
      setTimeout(() => {
        this.remainingTime -= 1;
        this.cdr.detectChanges();
        this.startTimer();
      }, 1000);
    }
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
    this.hostService.SendNavigate(this.roundId).pipe(
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
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });

    this.router.navigate(['/host', this.hostId, 'results', this.quizId, this.roundId]);
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
