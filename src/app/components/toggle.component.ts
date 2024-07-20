import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { Toggle } from '../models/toggle';

@Component({
  selector: 'app-toggle',
  template: `<span></span>`,
  styles: [
    `
      :host {
        display: block;
        background: var(--green);
        width: 30px;
        border-radius: 10px;
        padding: 2px;
        cursor: pointer;
        &.blend {
          span {
            margin: 0 auto;
          }
        }
        &.on {
          span {
            margin-left: auto;
          }
        }
      }

      span {
        display: block;
        height: 100%;
        width: 20px;
        border-radius: 7px;
        background: #fff;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  standalone: true
})
export class ToggleComponent {
  @HostBinding('class')
  @Input()
  toggled: Toggle = 'off';

  @Output() toggledChange = new EventEmitter<Toggle>();

  @HostListener('click') clicked() {
    switch (this.toggled) {
      case 'off':
        this.toggled = 'blend';
        break;
      case 'blend':
        this.toggled = 'on';
        break;
      case 'on':
        this.toggled = 'off';
        break;
    }
    this.toggledChange.emit(this.toggled);
  }
}
