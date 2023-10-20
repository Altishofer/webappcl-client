import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-word-calc',
  templateUrl: './word-calc.component.html',
  styleUrls: ['./word-calc.component.css']
})
export class WordCalcComponent implements AfterViewInit {
  enteredWords = [{subtract: false, word: ''}]

  changeSubtract(position: number, change: MatSlideToggleChange) {
    this.enteredWords[position]['subtract'] = change.checked;
  }

  changeWord(position: number, event: any) {
    this.enteredWords[position]['word'] = event.target.value;
  }

  addField() {
    this.enteredWords.push({subtract: false, word: ''})
  }

  printArray() {
    console.log(this.enteredWords);
  }



  @ViewChild('calculatorSwitch', { read: ElementRef }) element: ElementRef | undefined;

  private plus = 'M 11 4 L 11 11 L 4 11 L 4 13 L 11 13 L 11 20 L 13 20 L 13 13 L 20 13 L 20 11 L 13 11 L 13 4 Z';
  private minus = 'M 4 11 h 16 v 2 h -16 z';

  ngAfterViewInit() {
    if (this.element) {
      this.element.nativeElement.querySelector('.mdc-switch__icon--off').firstChild.setAttribute('d', this.plus);
      this.element.nativeElement.querySelector('.mdc-switch__icon--on').firstChild.setAttribute('d', this.minus);
    }
  }
}
