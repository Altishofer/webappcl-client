import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { catchError, Observable } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { PlayerService } from "@data/services/player.service";
import { Player } from "@data/interfaces/player.model";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  errorMsg : string = '';
  playerRegForm: FormGroup;
  unexpectedErrorMsg : string = "An unexpected error occurred."
  constructor(private playerService: PlayerService, private cookieService: CookieService, private router: Router, private fb: FormBuilder) {
    this.playerRegForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^(\S){1,50}$/)]]
    });

    this.playerRegForm.valueChanges.subscribe(value => {
      // console.log('Form value changed', value);
    });

    this.playerRegForm.statusChanges.subscribe(status => {
      if (status == "VALID"){
        this.player.playerName = this.playerRegForm.value.username;
      }
      console.log('Form status changed', status);
    });
  };

  player: Player = {
    playerName: ""
  };

  doRegister(): void {
    //this.actionWrapper(this.playerService.register.bind(this.playerService), "Register");
  }

  actionWrapper(serviceMethod: (player: Player) => Observable<any>, actionName: string): void {
    serviceMethod(this.player)
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
        console.log("response", JSON.stringify(response.body));
        if ((response.status >= 200 && response.status < 300) || response.status == 304) {
          this.cookieService.set('token', response.body.result);
          this.cookieService.set('playerName', this.player.playerName);
          console.log(actionName + " was successful -> user '" + this.player.playerName + "', received token: " + response.body.result);
          //this.playerService.refreshTokenPeriodically();
          this.router.navigate(['/home']);
        } else {
          this.errorMsg = this.unexpectedErrorMsg;
        }
      });
  }
}
