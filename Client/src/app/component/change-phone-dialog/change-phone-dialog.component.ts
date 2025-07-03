import { Component, OnInit } from '@angular/core';
import { UserService } from "../../service/user.service";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-change-phone-dialog',
  templateUrl: './change-phone-dialog.component.html',
  styleUrls: ['./change-phone-dialog.component.css']
})
export class ChangePhoneDialogComponent implements OnInit {

  constructor(private userService: UserService, private formBuilder: FormBuilder, private dialogueRef: MatDialogRef<ChangePhoneDialogComponent>,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.fetchCurrentPhone();
  }

  changePhoneForm = this.formBuilder.group({
    phone: ['', Validators.required],
  });

  changePhone() {
    if (this.changePhoneForm.valid && this.changePhoneForm.value.phone) {
      const newPhone = this.changePhoneForm.value.phone;
      this.userService.changePhone(newPhone).subscribe({
        next: () => {
          this.handleMessage("Phone changed successfully");
          this.dialogueRef.close();
        },
        error: (err) => {
          this.handleMessage(err.error.message);
        }
      });
    } else {
      this.handleMessage("Please enter a valid phone number.");
    }
  }

  private fetchCurrentPhone() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.changePhoneForm.patchValue({phone: user.phone});
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
