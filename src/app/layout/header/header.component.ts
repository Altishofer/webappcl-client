import { Component, Input } from '@angular/core';
import { SharedModule } from "@shared/shared.module";
import { OverlayModule } from "@angular/cdk/overlay";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    SharedModule,
    OverlayModule
  ]
})
export class HeaderComponent {
  @Input() currentPlayerName: string = '';
}
