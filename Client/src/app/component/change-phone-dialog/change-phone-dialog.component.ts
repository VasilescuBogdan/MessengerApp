import { Component } from '@angular/core';
import { UserService } from "../../service/user.service";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-change-phone-dialog',
  templateUrl: './change-phone-dialog.component.html',
  styleUrls: ['./change-phone-dialog.component.css']
})
export class ChangePhoneDialogComponent {

  constructor(private userService: UserService, private formBuilder: FormBuilder, private dialogueRef: MatDialogRef<ChangePhoneDialogComponent>) {
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
          alert("Phone changed successfully");
          this.dialogueRef.close();
        },
        error: (err) => {
          alert(err.error.message);
        }
      });
    } else {
      alert("Please enter a valid phone address.");
    }
  }

  private fetchCurrentPhone() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.changePhoneForm.patchValue({ phone: user.phone });
      },
      error: (err) => {
        console.log(err.error.message);
      }
    })
  }
}
