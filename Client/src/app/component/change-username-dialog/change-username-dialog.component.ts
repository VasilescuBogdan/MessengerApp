import { Component } from '@angular/core';
import { AuthService } from "../../service/auth.service";
import { UserService } from "../../service/user.service";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-change-username-dialog',
  templateUrl: './change-username-dialog.component.html',
  styleUrls: ['./change-username-dialog.component.css']
})
export class ChangeUsernameDialogComponent {

  constructor(private authService: AuthService, private userService: UserService, private formBuilder: FormBuilder,
              private dialogueRef: MatDialogRef<ChangeUsernameDialogComponent>, private snackBar: MatSnackBar) {
  }

  changeUsernameForm = this.formBuilder.group({
    username: [this.authService.getUsername(), Validators.required],
  });

  changeUsername() {
    if (this.changeUsernameForm.valid && this.changeUsernameForm.value.username) {
      const newUsername = this.changeUsernameForm.value.username;
      this.userService.changeUsername(newUsername).subscribe({
        next: () => {
          this.handleMessage("Username changed successfully");
          this.dialogueRef.close();
          this.authService.clear();
          window.location.reload();
        },
        error: (err) => {
          this.handleMessage(err.error.message);
        }
      });
    } else {
      this.handleMessage("Please enter a valid username address.");
    }
  }

  private handleMessage(message: string) {
    this.snackBar.open(message, '', {duration: 3000});
  }
}
