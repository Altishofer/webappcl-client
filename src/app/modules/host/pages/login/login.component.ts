import { Component } from '@angular/core';
import { Host } from "app/data/interfaces/host.model";
import { HostService } from "app/data/services/host.service";
import { CookieService } from "ngx-cookie-service";
import { catchError, Observable } from "rxjs";
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from "@angular/common/http";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  errorMsg : string = '';
  loginForm: FormGroup;
  isLogin: boolean = true;
  unexpectedErrorMsg : string = "An unexpected error occurred."
  constructor(private hostService: HostService, private cookieService: CookieService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^(\S){1,50}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(\S){1,50}$/)]]
    });

    this.loginForm.valueChanges.subscribe(value => {
      // console.log('Form value changed', value);
    });

    this.loginForm.statusChanges.subscribe(status => {
      if (status == "VALID"){
        this.host.hostName = this.loginForm.value.username;
        this.host.hostPassword = this.loginForm.value.password;
      }
      console.log('Form status changed', status);
    });
  };

  host: Host = {
    hostName: "",
    hostPassword: ""
  };

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.errorMsg = "";
  }

  doLogin(): void {
    this.actionWrapper(this.hostService.login.bind(this.hostService), "Login");
  }

  doRegister(): void {
    this.actionWrapper(this.hostService.register.bind(this.hostService), "Register");
  }

  doAction() {
    if (this.loginForm.valid) {
      if (this.isLogin) {
        this.doLogin();
      } else {
        this.doRegister();
      }
    }
  }

  actionWrapper(serviceMethod: (host: Host) => Observable<any>, actionName: string): void {
    serviceMethod(this.host)
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
          this.cookieService.set('hostToken', response.body.result);
          this.cookieService.set('hostName', this.host.hostName);
          console.log(actionName + " was successful -> user '" + this.host.hostName + "', received token: " + response.body.result);
          this.hostService.refreshTokenPeriodically();
          this.router.navigate(['/host/selection']);
        } else {
          this.errorMsg = this.unexpectedErrorMsg;
        }
      });
  }

}
