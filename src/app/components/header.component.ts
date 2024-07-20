import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ToggleComponent } from './toggle.component';
import { Toggle } from '../models/toggle';

@Component({
  selector: 'app-header',
  template: `<header>
    <h1>post reader</h1>
    <app-toggle [toggled]="toggled" (toggledChange)="toggledChange.emit($event)"></app-toggle>
  </header>`,
  styles: [
    `
      :host {
        display: block;
        background: #fff;
        overflow: hidden;
        padding: 10px 15px;
      }
      header {
        display: flex;
        justify-content: space-between;
        width: var(--site-width);
        margin: 0 auto;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToggleComponent],
  standalone: true
})
export class HeaderComponent {
  @Input() toggled: Toggle = 'off';
  @Output() toggledChange = new EventEmitter<Toggle>();
}
