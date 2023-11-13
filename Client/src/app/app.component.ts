import { Component } from '@angular/core';
import {AuthService} from "./service/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private authService: AuthService) {
  }

  isLoggedIn() {
    console.log(this.authService.isLoggedIn());
    return this.authService.isLoggedIn();
  }
}
