import { Component } from '@angular/core';
import { UserService } from "../../service/user.service";
import { FormBuilder, Validators } from "@angular/forms";
import { ChangePasswordDto } from "../../dto/change-password.dto";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css']
})
export class ChangePasswordDialogComponent {

  constructor(private userService: UserService, private formBuilder: FormBuilder, private dialogueRef: MatDialogRef<ChangePasswordDialogComponent>) {
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
          alert("Password changed successfully");
          this.dialogueRef.close();
        },
        error: (err) => {
          alert(err.error.message);
        }
      });
    }
  }
}
