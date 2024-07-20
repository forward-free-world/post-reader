import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ToggleComponent } from './toggle.component';
import { Toggle } from '../models/toggle';
import { Content } from '../models/content';

@Component({
  selector: 'app-header',
  template: `<header>
    <h1>post reader</h1>
    <app-toggle [toggled]="toggled" [caption]="caption" (toggledChange)="toggledChange.emit($event)"></app-toggle>
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
      app-toggle {
        width: 94px;
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

  @Input()
  caption!: Content;
}
