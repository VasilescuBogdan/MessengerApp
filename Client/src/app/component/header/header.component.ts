import { Component } from '@angular/core';
import { AuthService } from "../../service/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { ChangePasswordDialogComponent } from "../change-password-dialog/change-password-dialog.component";
import { ChangeEmailDialogComponent } from "../change-email-dialog/change-email-dialog.component";
import { ChangePhoneDialogComponent } from "../change-phone-dialog/change-phone-dialog.component";
import { ChangeUsernameDialogComponent } from "../change-username-dialog/change-username-dialog.component";

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

  openChangePasswordDialog() {
    this.dialog.open(ChangePasswordDialogComponent);
  }

  openChangeEmailDialog() {
    this.dialog.open(ChangeEmailDialogComponent);
  }

  openChangePhoneDialog() {
    this.dialog.open(ChangePhoneDialogComponent);
  }

  openChangeUsernameDialog() {
    this.dialog.open(ChangeUsernameDialogComponent);
  }
}
