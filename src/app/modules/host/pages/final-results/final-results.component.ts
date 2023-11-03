import {ChangeDetectorRef, Component} from '@angular/core';
import {IntermediateResult} from "@data/interfaces/IntermediateResult.model";
import {SignalRService} from "@data/services/SignalRService";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {PlayerService} from "@data/services/player.service";
import {HostService} from "@data/services/host.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-final-results',
  templateUrl: './final-results.component.html',
  styleUrls: ['./final-results.component.css']
})
export class FinalResultsComponent {
  quizId: string = '';
  hostId: string = '';
  unexpectedErrorMsg: string = "An unexpected error occurred."
  errorMsg: string = '';

  finalResult: IntermediateResult[] = [];

  constructor(
      private cdr: ChangeDetectorRef,
      private signalRService: SignalRService,
      private router: Router,
      private route: ActivatedRoute,
      private cookieService: CookieService,
      private playerService: PlayerService,
      private hostService: HostService
  ) {
    this.route.params.subscribe(params => {
      this.hostId = params['hostId'];
      this.quizId = params['quizId'];
    });
  }

  ngOnInit(): void {
    this.signalRService.startConnection().then(() => {
      this.registerToGroup();
    }).catch(error => {
      console.error("SignalR connection error:", error);
    });
    this.getFinalResult();
  }

  registerToGroup() {
    console.log("SOCKET: registerToGroup", this.quizId);
    this.signalRService.joinGroup(this.quizId);
  }


  getFinalResult(): void {
    console.log("REST: getFinalResult", this.quizId);
    this.hostService.getFinalResult(this.quizId).pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(JSON.stringify(error.error));
          if (error.status != 500) {
            this.errorMsg = error.error;
          } else {
            this.errorMsg = this.unexpectedErrorMsg;
          }
          return [];
        })
    ).subscribe((response: any): void => {
      if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        console.log(response.body);
        this.errorMsg = '';
        this.finalResult = response.body;
      } else {
        this.errorMsg = this.unexpectedErrorMsg;
      }
    });
  }

  returnToHome() {
    this.router.navigate(['/host', this.hostId, 'selection']);
  }
}

