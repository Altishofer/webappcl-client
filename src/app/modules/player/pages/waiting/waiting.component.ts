import { Component } from '@angular/core';
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
  player : string = "";

  constructor(
    private http: HttpClient,
    private signalRService: SignalRService,
    private router: Router,
    private route: ActivatedRoute,
  private cookieService: CookieService
  ) {
    this.player =  this.cookieService.get('playerName');
    this.players.push(this.player);
    this.route.params.subscribe(params => {
      this.quizId = params['quizId'];
    });
    this.signalRService.startConnection().then(()=> {
      console.log("Connection started");
      this.signalRService.joinGroup2("all");

      // this.signalRService.joinGroup(this.quizId, "players");
      // this.signalRService.setReceiveMessageListener((player: string) => {
      //   this.players.push(player);
      // });
      // this.signalRService.sendMessageToGroup(this.quizId, "players", this.player);

      // this.signalRService.joinGroup(this.quizId, "nextRound");
      // this.signalRService.setReceiveMessageListener((round: string) => {
      //   this.nextRound = round;
      // });
      // console.log("connection setup finished successfully");
    }).catch((err)=> {
      console.log(err);
    });
  };

  unregisterFromGroups() {
    this.signalRService.leaveGroup(this.quizId, "nextRound");
    this.signalRService.leaveGroup(this.quizId,"players");
  }
}
