import { Component } from '@angular/core';
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-headder',
  templateUrl: './headder.component.html',
  styleUrls: ['./headder.component.css']
})
export class HeadderComponent {

  constructor(private authService: AuthService) {
  }

  logout() {
    this.authService.clear();
  }
}
