import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { GroupChatService } from "../../service/group-chat.service";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-add-group-dialog',
  templateUrl: './add-group-dialog.component.html',
  styleUrls: ['./add-group-dialog.component.css']
})
export class AddGroupDialogComponent {
  constructor(private formBuilder: FormBuilder, private groupChatService: GroupChatService,
              private dialogRef: MatDialogRef<AddGroupDialogComponent>) {
  }

  addGroupForm = this.formBuilder.group({
    name: ['', Validators.required]
  });

  addGroup() {
    if (this.addGroupForm.valid && this.addGroupForm.value.name) {
      this.groupChatService.createGroupChat(this.addGroupForm.value.name).subscribe({
        next: () => {
          console.log("Group chat created successfully");
          this.dialogRef.close();
        },
        error: err => {
          console.error(err);
        }
      })
    }
  }
}
