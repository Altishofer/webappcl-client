import { Component } from '@angular/core';
import { HostService } from "@data/services/host.service";
import {Host} from "@data/interfaces/host.model";
import {catchError, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  errorMsg : string = "";
  constructor(private hostService: HostService, private cookieService: CookieService) {
  }

  host: Host = {
    hostName: "",
    hostPassword: ""
  };

  addHost(): void {
    this.hostService.register(this.host)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status != 500) {
            this.errorMsg = error.message;
          } else {
            this.errorMsg = "An unexpected error occurred";
          }
          return throwError(error.message);
        })
      )
      .subscribe((response: any): void => {
        if (response.ok) {
          this.cookieService.set('token', response.token);
          this.cookieService.set('hostName', this.host.hostName);
          console.log("Register was successful: " + this.host.hostName + ", received token: " + response.token);
          this.hostService.refreshTokenPeriodically();
        } else {
          this.errorMsg = "An unexpected error occurred";
        }
      });
  }

  onKey_hostName(value: string) {
    this.host.hostName = value;
  }

  onKey_password(value: string) {
    this.host.hostPassword = value;
  }
}
