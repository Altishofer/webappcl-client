import { Component } from '@angular/core';
import { UserService } from "@data/services/user.service";
import { User } from "@app/data/interfaces/user.model";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{

  constructor(private userService:UserService) {}

  user: User = {
    userId: 1,
    userName: "",
    userPassword: "",
    token: "someToken"
  };

  addUser() {
    this.userService.register(this.user);
  }

  onKey_userName(value: string) {
    this.user.userName = value;
  }

  onKey_password(value: string) {
    this.user.userPassword = value;
  }
}
