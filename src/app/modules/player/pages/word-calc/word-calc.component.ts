import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-word-calc',
  templateUrl: './word-calc.component.html',
  styleUrls: ['./word-calc.component.css']
})
export class WordCalcComponent implements AfterViewInit {
  enteredWords = [{subtract: false, word: ''}]

  updateSubtract(position: number) {
    console.log(position);
  }
  addField() {
    this.enteredWords.push({subtract: false, word: ''})
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
