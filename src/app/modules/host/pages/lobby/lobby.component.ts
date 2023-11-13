import { Component } from '@angular/core';
import {SignalRService} from "@data/services/SignalRService";
import {ActivatedRoute, Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {PlayerService} from "@data/services/player.service";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {HostService} from "@data/services/host.service";
import {FormArray, FormGroup} from "@angular/forms";
import {Round} from "@data/interfaces/round.model";
import { Options } from 'ngx-qrcode-styling';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent {
  public config: Options = {
    template: 'ocean',
    data : 'default',
    frameOptions: {
      style: 'F_036',
      width: 300,
      height: 300
    }
  };
  QRvalue = '';
  quizId: string = '';
  players: string[] = [];
  unexpectedErrorMsg : string = "An unexpected error occurred."
  errorMsg : string = '';
  roundIds : string[] = [];
  hostId : string = '';
  joinUrl : string = '';

  constructor(
    private signalRService: SignalRService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private hostService: HostService
  ) {
    this.route.params.subscribe(params => {
      this.quizId = params['quizId'];
      this.hostId = params['hostId'];
    });
    this.QRvalue = this.hostService.ngUrl + 'player/register/' + this.quizId;
    this.joinUrl = this.hostService.ngUrl + 'join/';
  }

  ngOnInit(): void {
    this.signalRService.startConnection().then(() => {
      this.registerListeners();
      this.registerToGroup();
    }).catch(error => {
      console.error("SignalR connection error:", error);
    });
    this.getRounds();
  }

  getPlayers(): void {
    this.hostService.getPlayers(this.quizId).subscribe(
      (response: any): void => {
        if ((response.status >= 200 && response.status < 300) || response.status == 304) {
          if (response.body.message == ""){
            this.players = [];
          } else {
            this.players = response.body.message.split(" ");
          }
        } else {
          console.log("ERROR: updating players via REST");
        }
      });
  }

  getRounds(): void {
    this.hostService.getAllRoundIdsByQuiz(this.quizId).subscribe(
      (response: any): void => {
        if ((response.status >= 200 && response.status < 300) || response.status == 304) {
          this.roundIds = response.body;
          this.cookieService.set("roundIds", this.roundIds.join(","), new Date().setHours(new Date().getHours() + 1));
          this.getPlayers();
        } else {
          console.log("ERROR: updating roundIds via REST");
        }
      });
  }

  registerToGroup() {
    this.signalRService.joinGroup(this.quizId);
  }

  unregisterFromGroup() {
    this.signalRService.leaveGroup(this.quizId);
  }

  registerListeners(): void {
    this.signalRService.setReceivePlayerListener((player: string) => {
      this.players = player.split(" ");
    });

    this.signalRService.setReceiveRoundListener((round: string) => {
      this.router.navigate(['/host', this.hostId, 'round', this.quizId, round]);
    });
  }

  startGame() {
    let roundId : string = "";
    let rounds : string = this.cookieService.get("roundIds");
    let roundIds : string[] = rounds.split(",");
    if (roundIds.length != 0){
      roundId = roundIds.shift() as string;
      this.cookieService.set("roundIds", roundIds.join(","), new Date().setHours(new Date().getHours() + 1));
      this.pushRound(roundId);
    } else {
      this.router.navigate(['/host', this.hostId, 'results', this.quizId, -1]);
    }
  }

  pushRound(roundId : string) {
    this.hostService.pushRound(roundId).subscribe(
      (response: any): void => {
        if ((response.status >= 200 && response.status < 300) || response.status == 304) {
        } else {
          console.log("ERROR: updating rounds via REST");
        }
      });
  }

  protected readonly URL = URL;
}
