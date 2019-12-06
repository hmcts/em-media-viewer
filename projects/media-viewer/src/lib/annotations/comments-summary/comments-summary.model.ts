import { Comment } from '../comment-set/comment/comment.model';

export interface CommentsSummary {
  page: number;
  comment: Comment;
  x: number;
  y: number;
}
