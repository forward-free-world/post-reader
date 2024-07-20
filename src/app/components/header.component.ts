import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ToggleComponent } from './toggle.component';
import { Toggle } from '../models/toggle';
import { Content } from '../models/content';

@Component({
  selector: 'app-header',
  template: `<header>
    <h1>post reader</h1>
    <div>
      <app-toggle [toggled]="toggled" [caption]="caption" (toggledChange)="toggledChange.emit($event)"></app-toggle>
      <lucide-icon name="info" [size]="22" [strokeWidth]="1"></lucide-icon>
    </div>
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
        align-items: center;
        width: var(--site-width);
        margin: 0 auto;
      }
      div {
        display: flex;
        align-items: center;
      }
      app-toggle {
        width: 60px;
        margin-right: 12px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToggleComponent, LucideAngularModule],
  standalone: true
})
export class HeaderComponent {
  @Input() toggled: Toggle = 'off';
  @Output() toggledChange = new EventEmitter<Toggle>();

  @Input()
  caption!: string;
}
