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

  ngOnInit() {
    this.getRound();
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
}
