import {Component, ViewChild} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {SignalRService} from "@data/services/SignalRService";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.css']
})

export class WaitingComponent {
  quizId! : string;
  players : string[] = [];
  nextRound : string = "";
  playerName : string = "";
  messages : string[] = [];

  constructor(
    private signalRService: SignalRService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService
  ) {
    this.playerName =  this.cookieService.get('playerName') ?? "default_player";
    this.route.params.subscribe(params => {
      this.quizId = params['quizId'];
    });
    this.players.push(this.playerName);

    this.signalRService.startConnection().then(() => {
      this.registerListeners();
      this.registerToGroup();
    }).catch(error => {
      console.error("SignalR connection error:", error);
    });
  }

  sendMessage() {
    console.log("start sending", this.quizId);
    this.signalRService.sendMessageToGroup(this.quizId, "test");
  }

  registerToGroup() {
    console.log("registerToGroup", this.quizId);
    this.signalRService.joinGroup(this.quizId, this.playerName);
  }

  unregisterFromGroup() {
    this.signalRService.leaveGroup(this.quizId, this.playerName);
  }

  registerListeners() : void{
    this.signalRService.setReceiveMessageListener((message: string) => {
      console.log("message", message);
        this.messages.push(message);
    });

    this.signalRService.setReceivePlayerListener((player: string) => {
      console.log("player", player);
      this.players.push(player);
    });

    this.signalRService.setReceiveRoundListener((round: string) => {
      console.log("player", round);
      this.nextRound = round;
    });
  }
}
