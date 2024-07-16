import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Post } from '../models/post';
import { PostReader } from '../services/post-reader.service';

@Component({
  selector: 'app-post',
  template: `<h3>{{ post.title }}</h3>
    @if(post.image) {
    <picture>
      <img [src]="post.image" />
    </picture>
    } @if(post.link) {
    <a [href]="post.link" target="_blank">{{ post.link }}</a>
    } @if(post.tags.length) {
    <div class="tags">
      <span>Tags:&nbsp;</span> @for(tag of post.tags; track tag; let i = $index) { @if(i) {, }
      <span class="tag">#{{ tag }}</span>
      }
    </div>

    @if(markdown) {
    <article [innerHTML]="markdown"></article>
    } } `,
  styles: [
    `
      :host {
        display: block;
        background: #fff;
        padding: 15px 30px 25px;
        h3 {
          text-align: center;
        }
        a {
          display: block;
          text-align: center;
          margin: 0 0 5px;
          font-size: 0.85rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tags {
          margin-bottom: 25px;
          font-size: 0.85arem;
          text-align: center;
        }
        .tag {
          cursor: pointer;
        }
        picture {
          display: block;
          margin-bottom: 15px;
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
  markdown!: string;
  private _post!: Post;

  @Input()
  set post(post: Post) {
    this.markdown = PostReader.markdownToHtml(post.comment);
    this._post = post;
  }
  get post(): Post {
    return this._post;
  }
}
