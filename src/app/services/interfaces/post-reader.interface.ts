import { Observable } from 'rxjs';
import { Post } from '../../models/post';
import { PostQuery } from '../../models/post-query';

export interface IPostReader {
  getTags(): Observable<string[]>;
  getPosts(postQuery?: PostQuery): Observable<Post[]>;
}
