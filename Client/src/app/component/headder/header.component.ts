import { Component } from '@angular/core';
import { AuthService } from "../../service/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { ChangePasswordDialogComponent } from "../change-password-dialog/change-password-dialog.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private authService: AuthService, private dialog: MatDialog) {
  }

  logout() {
    this.authService.clear();
    window.location.reload();
  }

  openNewPasswordDialog() {
    this.dialog.open(ChangePasswordDialogComponent);
  }
}
