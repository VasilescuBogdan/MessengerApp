import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { GroupChatService } from "../../service/group-chat.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-change-group-name-dialog',
  templateUrl: './change-group-name-dialog.component.html',
  styleUrls: ['./change-group-name-dialog.component.css']
})
export class ChangeGroupNameDialogComponent {

  constructor(private formBuilder: FormBuilder, private groupChatService: GroupChatService, private dialogRef: MatDialogRef<ChangeGroupNameDialogComponent>,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) private data: {
                groupName: string;
                groupId: string;
              }) {
  }

  changeNameForm = this.formBuilder.group({
    name: [this.data.groupName, Validators.required]
  });

  changeGroupName() {
    const newName = this.changeNameForm.value.name;
    if (this.changeNameForm.valid && newName) {
      this.groupChatService.changeGroupName(this.data.groupId, newName).subscribe({
        next: () => {
          this.snackBar.open("Group name changed successfully", '', {duration: 3000});
          this.dialogRef.close(newName);
        },
        error: err => {
          console.error(err);
        }
      })
    }
  }
}
