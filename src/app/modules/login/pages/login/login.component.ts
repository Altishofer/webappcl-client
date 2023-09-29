import { Component } from '@angular/core';
import {User} from "@data/interfaces/user.model";
import {UserService} from "@data/services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private userService: UserService) {}

  user: User = {
    userId: "",
    userName: "",
    password: "",
    token: ""
  };

  ngOnInit(): void {
    const user: User = {
      userId:'testUserUUID',
      userName:'testUserName',
      password:'testUserPassword',
      token:'testUserToken'
    };
  }

  doLogin() {
    console.log(this.user);
  }

  onKey_userName(value: string) {
    this.user.userName = value;
  }

  onKey_password(value: string) {
    this.user.password = value;
  }
}
