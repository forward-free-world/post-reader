import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-filter',
  template: `#{{ tag }}`,
  styles: [
    `
      :host {
        display: inline-block;
        padding: 4px 12px 5px;
        border-radius: 15px;
        color: #fff;
        line-height: 1em;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        &.selected {
          background: black;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class FilterComponent {
  @Input()
  @HostBinding('class.selected')
  selected = false;
  @Input() tag!: string;

  @HostBinding('class')
  class = 'green-bg';
}
