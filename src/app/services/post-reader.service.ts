import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ImageRegex, LinkRegex, MetaDataRegex, TagsRegex, TitleRegex } from '../../utilities';
import * as post from '../../../out/all.md';
import { IPostReader } from './interfaces/post-reader.interface';
import { Post } from '../models/post';
import { PostQuery } from '../models/post-query';
import * as showdown from 'showdown';

@Injectable({
  providedIn: 'root'
})
export class PostReader implements IPostReader {
  private readonly _posts$ = new BehaviorSubject<Post[]>([]);

  static showdown = new showdown.Converter();

  static markdownToHtml(markdown: string): string {
    const m = markdown.replace(/(#{1,4})(\s)/g, '$1## ');
    return this.showdown.makeHtml(m);
  }

  getTags(): Observable<string[]> {
    return this.getPosts().pipe(
      map(posts =>
        Array.from(
          posts.reduce((tags: Set<string>, post: Post) => {
            post.tags.forEach(t => tags.add(t));
            return tags;
          }, new Set<string>())
        )
      )
    );
  }

  getPosts(postQuery?: PostQuery): Observable<Post[]> {
    if (this._posts$.getValue().length === 0) {
      const posts = this.loadPostsFromDisk();
      this._posts$.next(posts);
    }

    return this._posts$.asObservable().pipe(
      map(posts => {
        const { tags = [] } = postQuery ?? {};
        if (tags.length) {
          posts = posts.filter(p => p.tags.some(t => tags.includes(t)));
        }

        return posts;
      })
    );
  }

  private loadPostsFromDisk(): Post[] {
    return post.default.split('\n%%%break%%%\n').map(this.parsePosts);
  }

  private parsePosts(rawPost: string): Post {
    const [metaData] = MetaDataRegex.exec(rawPost) ?? [null];

    let title: string | null = null,
      tags: string[] = [],
      link: string | null = null,
      image: string | null = null;

    if (metaData) {
      title = (TitleRegex.exec(metaData) ?? [null, null])[1];

      const tagsMatch = TagsRegex.exec(metaData);
      if (tagsMatch) tags = tagsMatch[1].split(',').map(tagString => tagString.replace('#', '').trim());

      link = (LinkRegex.exec(metaData) ?? [null, null])[1];
      image = (ImageRegex.exec(metaData) ?? [null, null])[1];
    }

    return {
      comment: rawPost.substring(metaData?.length ?? 0).trim(),
      content: rawPost.substring(metaData?.length ?? 0).trim(),
      image,
      link,
      tags,
      title
    };
  }
}
