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
  template: `<div [ngClass]="toggled"><span></span></div>
    @if (caption) { <span>{{ caption }}</span> }`,
  styles: [
    `
      :host {
        display: flex;
      }

      div {
        display: block;
        background: #000;
        width: 30px;
        height: 15px;
        border-radius: 10px;
        padding: 2px;
        cursor: pointer;
        transition: background 0.15s;
        &.blend {
          background: var(--green);
          span {
            left: 5px;
          }
        }
        &.on {
          background: var(--green);
          span {
            left: 10px;
          }
        }
        span {
          display: block;
          position: relative;
          height: 100%;
          width: 20px;
          border-radius: 7px;
          background: #fff;
          transition: left 0.25s;
          left: 0;
        }
        + span {
          margin-left: 5px;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  standalone: true
})
export class ToggleComponent {
  @Input() caption!: string;

  @Input()
  toggled: Toggle = 'off';

  @Output() toggledChange = new EventEmitter<Toggle>();

  @HostListener('click') clicked() {
    switch (this.toggled) {
      case 'off':
        this.toggled = 'on';
        break;
      case 'blend':
        this.toggled = 'off';
        break;
      case 'on':
        this.toggled = 'blend';
        break;
    }
    this.toggledChange.emit(this.toggled);
  }
}
