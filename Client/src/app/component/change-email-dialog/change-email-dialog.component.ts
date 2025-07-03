import { Component, OnInit } from '@angular/core';
import { UserService } from "../../service/user.service";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-change-email-dialog',
  templateUrl: './change-email-dialog.component.html',
  styleUrls: ['./change-email-dialog.component.css']
})
export class ChangeEmailDialogComponent implements OnInit {
  constructor(private userService: UserService, private formBuilder: FormBuilder, private dialogueRef: MatDialogRef<ChangeEmailDialogComponent>,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
        this.fetchCurrentEmail();
    }

  changeEmailForm = this.formBuilder.group({
    email: ['', Validators.required],
  });

  changeEmail() {
    if (this.changeEmailForm.valid && this.changeEmailForm.value.email) {
      const newEmail = this.changeEmailForm.value.email;
      this.userService.changeEmail(newEmail).subscribe({
        next: () => {
          this.handleMessage("Email changed successfully");
          this.dialogueRef.close();
        },
        error: (err) => {
          alert(err.error.message);
        }
      });
    } else {
      this.handleMessage("Please enter a valid email address.");
    }
  }

  private fetchCurrentEmail() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.changeEmailForm.patchValue({ email: user.email });
      },
      error: (err) => {
        console.log(err.error.message);
      }
    })
  }

  handleMessage(message: string) {
    this.snackBar.open(message, '', {duration: 3000});
  }
}
