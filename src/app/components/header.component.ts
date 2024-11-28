import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output
} from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ToggleComponent } from './toggle.component';
import { Toggle } from '../models/toggle';
import { SITE_TITLE } from '../tokens/site-title.token';

@Component({
  selector: 'app-header',
  template: `<header>
    <h1>{{ siteTitle }}</h1>
    @if(enableAI) {
    <div>
      <app-toggle [toggled]="toggled" [caption]="caption" (toggledChange)="toggledChange.emit($event)"></app-toggle>
      <lucide-icon
        name="info"
        [size]="22"
        [strokeWidth]="1"
        data-tooltip="For each hyperlink submitted by a contributor, inlcuding a summary is optional. For hyperlinked articles submitted without a summary, we will create one with the assistance of generative AI (indicated).

  &middot; Toggle once to display AI summaries for all
  &middot; Toggle twice to display user-submitted & AI summaries"
      ></lucide-icon>
    </div>
    }
  </header>`,
  styles: [
    `
      :host {
        display: block;
        background: #fff;
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
        margin-right: 6px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToggleComponent, LucideAngularModule],
  standalone: true
})
export class HeaderComponent {
  readonly siteTitle = inject(SITE_TITLE);

  @Input({ transform: booleanAttribute }) enableAI = false;
  @Input() caption!: string;
  @Input() toggled: Toggle = 'off';
  @Output() toggledChange = new EventEmitter<Toggle>();
}
