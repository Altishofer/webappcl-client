import {Component} from '@angular/core';
import { SharedModule } from "@shared/shared.module";
import { OverlayModule } from "@angular/cdk/overlay";
import {RegexTesterComponent} from "@layout/regex-tester/regex-tester.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    SharedModule,
    OverlayModule,
    RegexTesterComponent
  ]
})
export class HeaderComponent {
  isTesterOpen: boolean = false;
}
