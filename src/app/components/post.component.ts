import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Post } from '../models/post';

@Component({
  selector: 'app-post',
  template: `<h3>{{ post.title }}</h3>
    @if(post.link) {
    <a [href]="post.link" target="_blank">{{ post.link }}</a>
    } @if(post.tags.length) {
    <div class="tags">
      <span>Tags:&nbsp;</span> @for(tag of post.tags; track tag; let i = $index) { @if(i) {, }
      <span class="tag">#{{ tag }}</span>
      }
    </div>
    <article>
      @if(post.image) {
      <picture>
        <img [src]="post.image" />
      </picture>
      }
      <h4>Content</h4>
      <p>{{ post.content }}</p>
    </article>
    } `,
  styles: [
    `
      :host {
        display: block;
        border: 1px dashed black;
        border-radius: 8px;
        padding: 15px 30px 0;
        h3 {
          text-align: center;
        }
        a {
          display: block;
          text-align: center;
          margin: 15px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tags {
          margin-bottom: 25px;
          text-align: center;
        }
        .tag {
          cursor: pointer;
        }
        article {
          padding: 0 0 30px;
        }
        img {
          display: block;
          width: 100%;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class PostComponent {
  @Input() post!: Post;
}
