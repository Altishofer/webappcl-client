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

  ngOnInit(): void {
    const user: User = {
      userId:'testUserUUID',
      userName:'testUserName',
      password:'testUserPassword',
      token:'testUserToken'
    };

    const token = 'Bearer your-token-here';

    this.userService.getUser(user, token).subscribe(
      (response) => {

        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
