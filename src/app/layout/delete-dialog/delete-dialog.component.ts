import {Component, Inject} from '@angular/core';
import { SharedModule } from "../../shared/shared.module";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Quiz} from "../../data/interfaces/quiz.model";

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css'],
  standalone: true,
  imports: [
    SharedModule,
    MatDialogModule
  ]
})
export class DeleteDialogComponent {
  constructor(
      public dialogRef: MatDialogRef<DeleteDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Quiz) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick() {
    this.dialogRef.close();
  }
}
