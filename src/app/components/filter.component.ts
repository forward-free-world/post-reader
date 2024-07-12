import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-filter',
  template: `#{{ tag }}`,
  styles: [
    `
      :host {
        background: green;
        display: inline-block;
        padding: 4px 15px 6px;
        border-radius: 15px;
        color: #fff;
        line-height: 1em;
        cursor: pointer;
        &.selected {
          background: blue;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FilterComponent {
  @Input()
  @HostBinding('class.selected')
  selected = false;
  @Input() tag!: string;
}
