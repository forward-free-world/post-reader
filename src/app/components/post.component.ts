import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input
} from '@angular/core';
import { MARKDOWN_CONVERTER } from '../tokens/markdown-converter.token';
import { Post } from '../models/post';

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
    } }
    <summary>{{ summary }}</summary> `,
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class PostComponent implements AfterViewInit {
  markdown!: string;
  summary!: string;
  private _post!: Post;
  private readonly elementRef = inject(ElementRef);
  private readonly markdownConverter = inject(MARKDOWN_CONVERTER);
  private readonly spy = inject(ChangeDetectorRef);

  @Input()
  set post(post: Post) {
    this.markdown = this.markdownToHtml(post.comment);
    this.getSummary(post.link ?? '').then(summary => {
      this.summary = summary;
      this.spy.detectChanges();
    });
    this._post = post;
  }
  get post(): Post {
    return this._post;
  }

  ngAfterViewInit() {
    const anchors: HTMLAnchorElement[] = Array.from(this.elementRef.nativeElement.querySelectorAll('article a'));
    anchors.forEach(a => {
      a.target = '_blank';
    });
  }

  private markdownToHtml(markdown: string): string {
    const m = markdown.replace(/(#{1,4})(\s)/g, '$1## ');
    return this.markdownConverter.makeHtml(m);
  }

  private async getSummary(link: string): Promise<string> {
    const filename = btoa(link),
      summary = await import(`../../../out/summaries/${filename}.txt`);

    return summary.default;
  }
}
