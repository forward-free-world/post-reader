import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './components/filter.component';
import { PostComponent } from './components/post.component';
import { PostQuery } from './models/post-query';
import { POST_READER } from './tokens/post-reader.token';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FilterComponent, CommonModule, PostComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  postQuery: PostQuery = {};
  posts = inject(POST_READER);
  spy = inject(ChangeDetectorRef);

  clickTag(tag: string) {
    const { tags = [] } = this.postQuery;

    if (tags?.includes(tag)) {
      const tagIndex = tags.findIndex(t => t === tag);
      tags.splice(tagIndex, 1);
      if (tags.length === 0) {
        delete this.postQuery.tags;
      }
    } else {
      tags.push(tag);
    }

    if (tags.length) {
      this.postQuery.tags = tags;
    }

    this.spy.detectChanges();
  }

  tagSelected(tag: string): boolean {
    return this.postQuery.tags?.includes(tag) ?? false;
  }
}
