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

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent {
  QRvalue = 'https:///';

  quizId: string = '';
  players: string[] = [];
  unexpectedErrorMsg : string = "An unexpected error occurred."
  errorMsg : string = '';
  roundIds : string[] = [];
  hostId : string = '';

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
    this.QRvalue = 'https://localhost:4200/player/' + this.quizId;
  }

  ngOnInit(): void {
    this.signalRService.startConnection().then(() => {
      this.registerListeners();
      this.registerToGroup();
    }).catch(error => {
      console.error("SignalR connection error:", error);
    });
    this.getRounds();
    this.getPlayers();
  }

  getPlayers(): void {
    this.hostService.getPlayers(this.quizId).subscribe(
      (response: any): void => {
        if ((response.status >= 200 && response.status < 300) || response.status == 304) {
          console.log("REST player: ", response.body);
          this.players = response.body.message.split(" ");
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
          this.cookieService.set("roundIds", this.roundIds.join(","));
        } else {
          console.log("ERROR: updating roundIds via REST");
        }
      });
  }

  registerToGroup() {
    console.log("SOCKET: registerToGroup", this.quizId);
    this.signalRService.joinGroup(this.quizId);
  }

  unregisterFromGroup() {
    console.log("SOCKET: unregister from group", this.quizId);
    this.signalRService.leaveGroup(this.quizId);
  }

  registerListeners(): void {
    this.signalRService.setReceivePlayerListener((player: string) => {
      console.log("SOCKET player: ", player);
      this.players = player.split(" ");
    });

    this.signalRService.setReceiveRoundListener((round: string) => {
      console.log("SOCKET round: ", round);
      this.router.navigate(['/host', this.hostId, 'round', this.quizId, round]);
    });
  }

  startGame() {
    let roundId : string = "";
    let rounds : string = this.cookieService.get("roundIds");
    let roundIds : string[] = rounds.split(",");
    if (roundIds.length != 0){
      roundId = roundIds.shift() as string;
      this.cookieService.set("roundIds", roundIds.join(","));
      this.pushRound(roundId);
    } else {
      this.router.navigate(['/host', this.hostId, 'results', this.quizId]);
    }
  }

  pushRound(roundId : string) {
    this.hostService.pushRound(roundId).subscribe(
      (response: any): void => {
        if ((response.status >= 200 && response.status < 300) || response.status == 304) {
          console.log("REST pushRound: ", response.body);
        } else {
          console.log("ERROR: updating rounds via REST");
        }
      });
  }
}
