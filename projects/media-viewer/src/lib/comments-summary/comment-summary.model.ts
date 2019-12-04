import { Comment } from '../annotations/comment-set/comment/comment.model';

export interface CommentSummary {
  page: number;
  comment: Comment;
}
