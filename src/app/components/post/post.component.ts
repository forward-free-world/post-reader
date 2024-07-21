import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output
} from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

import { Content } from '../../models/content';
import { MARKDOWN_CONVERTER } from '../../tokens/markdown-converter.token';
import { Post } from '../../models/post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class PostComponent implements AfterViewInit {
  @Input() content!: Content;
  @Output() tagSelected = new EventEmitter<string>();

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
    const m = markdown.replace(/(#{1,4})(\s)/g, '$1### ');
    return this.markdownConverter.makeHtml(m);
  }

  private async getSummary(link: string): Promise<string> {
    const filename = btoa(link),
      summary = await import(`../../../../out/summaries/${filename}.txt`);

    return summary.default;
  }
}
