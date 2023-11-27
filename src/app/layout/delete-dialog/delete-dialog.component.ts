import {Component, Inject} from '@angular/core';
import { SharedModule } from "@shared/shared.module";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Quiz } from "@data/interfaces/quiz.model";
import {Router} from "@angular/router";
import {catchError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {QuizService} from "@data/services/quiz.service";

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css'],
  standalone: true,
  imports: [
    SharedModule
  ]
})
export class DeleteDialogComponent {
  errorMsg : string = '';
  unexpectedErrorMsg : string = "An unexpected error occurred."

  constructor(
      private _quizService: QuizService,
      private _dialogRef: MatDialogRef<DeleteDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Quiz) {
  }

  onNoClick(): void {
    this._dialogRef.close(false);
  }

  onYesClick() {
    this._quizService.deleteQuiz(this.data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(JSON.stringify(error.error));
          if (error.status != 500) {
            this.errorMsg = error.error;
          } else {
            this.errorMsg = this.unexpectedErrorMsg;
          }
          return[];
        })
      )
      .subscribe((response: any): void => {
        if ((response.status >= 200 && response.status < 300) || response.status == 304) {
          this._dialogRef.close(true);
        } else {
          this.errorMsg = this.unexpectedErrorMsg;
        }
      });
    this._dialogRef.close(true);
  }
}
