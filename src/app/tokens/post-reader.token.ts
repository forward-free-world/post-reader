import { InjectionToken } from '@angular/core';
import { IPostReader } from '../services/interfaces/post-reader.interface';

export const POST_READER = new InjectionToken<IPostReader>('Post reader');
