import { InjectionToken } from '@angular/core';
import Showdown from 'showdown';

export const MARKDOWN_CONVERTER = new InjectionToken<Showdown.Converter>('Markdown converter');
