import { Component } from '@angular/core';
import { UserService } from "../../service/user.service";
import { FormBuilder, Validators } from "@angular/forms";
import { ChangePasswordDto } from "../../dto/change-password.dto";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent {

  constructor(private userService: UserService, private formBuilder: FormBuilder, private dialogueRef: MatDialogRef<ChangePasswordDialogComponent>,
              private snackBar: MatSnackBar) {
  }

  changePasswordForm = this.formBuilder.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', Validators.required]
  });

  changePassword() {
    if (this.changePasswordForm.valid && this.changePasswordForm.value.oldPassword && this.changePasswordForm.value.newPassword) {
      const changePasswordData: ChangePasswordDto = {
        oldPassword: this.changePasswordForm.value.oldPassword,
        newPassword: this.changePasswordForm.value.newPassword
      };
      this.userService.changePassword(changePasswordData).subscribe({
        next: () => {
          this.handleMessage("Password changed successfully");
          this.dialogueRef.close();
        },
        error: (err) => {
          this.handleMessage(err.error.message);
        }
      });
    }
  }

  private handleMessage(message: string) {
    this.snackBar.open(message, '', {duration: 3000});
  }
}
