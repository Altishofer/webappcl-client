import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { PlayerService } from "@data/services/player.service";
import { SignalRService } from "@data/services/SignalRService";

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.css']
})
export class WaitingComponent implements OnInit {
  quizId!: string;
  players: string[] = [];
  nextRound: string = "";
  playerName: string = "";
  messages: string[] = [];

  constructor(
    private signalRService: SignalRService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private playerService: PlayerService
  ) {
    this.playerName = this.cookieService.get('playerName') ?? "default_player";
    this.route.params.subscribe(params => {
      this.quizId = params['quizId'];
    });
    this.players.push(this.playerName);
  }

  ngOnInit(): void {
    this.signalRService.startConnection().then(() => {
      this.registerListeners();
      this.registerToGroup();
    }).catch(error => {
      console.error("SignalR connection error:", error);
    });
    this.getPlayers();
  }

  getPlayers(): void {
    this.playerService.getPlayers(this.quizId).subscribe(
      (response: any): void => {
        if ((response.status >= 200 && response.status < 300) || response.status == 304) {
          console.log("REST player: ", response.body);
          this.players = response.body.message.split(" ");
        } else {
          console.log("ERROR: updating players via REST");
        }
      });
  }

  registerToGroup() {
    console.log("SOCKET: registerToGroup", this.quizId);
    this.signalRService.joinGroup(this.quizId, this.playerName);
  }

  unregisterFromGroup() {
    console.log("SOCKET: unregister from group", this.quizId);
    this.signalRService.leaveGroup(this.quizId, this.playerName);
  }

  registerListeners(): void {
    this.signalRService.setReceiveMessageListener((message: string) => {
      console.log("SOCKET message:", message);
      this.messages.push(message);
    });

    this.signalRService.setReceivePlayerListener((player: string) => {
      console.log("SOCKET player: ", player);
      this.players = player.split(" ");
    });

    this.signalRService.setReceiveRoundListener((round: string) => {
      console.log("SOCKET round: ", round);
      this.nextRound = round;
    });
  }

  switchToRound(roundId:number): void {
    this.router.navigate(['/player', 'game', this.quizId, roundId]);
  }
}
