import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  Renderer2
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Annotation, Comment } from '../../annotation-set.model';

@Component({
    selector: 'app-comment-item',
    templateUrl: './comment-item.component.html',
    styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent implements OnInit, OnDestroy {

    private commentBtnSub: Subscription;
    private commentFocusSub: Subscription;
    private dataLoadedSub: Subscription;
    hideButton: boolean;
    focused: boolean;
    sliceComment: string;

    @Input() comment: Comment;
    @Input() annotation: Annotation;

    @Output() commentSubmitted: EventEmitter<any> = new EventEmitter<any>();
    @Output() commentRendered: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('commentSelector') commentSelector: ElementRef;
    @ViewChild('commentArea') commentArea: ElementRef;
    @ViewChild('commentItem') commentItem: NgForm;
    @ViewChild('detailsWrapper') detailsWrapper: ElementRef;
    @ViewChild('commentDate') commentDate: ElementRef;

    model = new Comment(null, null, null, null, null, null, null, null, null);
    commentTopPos: number;
    commentHeight: number;
    annotationTopPos: number;
    annotationLeftPos: number;
    annotationHeight: number;

    constructor(private ref: ChangeDetectorRef,
                private renderer: Renderer2) {
    }

    ngOnInit() {
        this.hideButton = true;
        this.focused = false;
        this.sliceComment = this.comment.content;

        this.commentItem.statusChanges.subscribe(
                () => {
                    if (this.focused) {
                        this.expandComment();
                    }
                }
            );
    }

    setHeight() {
        this.renderer.setStyle(this.commentArea.nativeElement, 'height', 'fit-content');
        this.renderer.setStyle(this.commentArea.nativeElement, 'height', (this.commentArea.nativeElement.scrollHeight) + 'px');
        this.commentHeight =  this.commentSelector.nativeElement.getBoundingClientRect().height;
        this.commentRendered.emit(true);
        if (!this.ref['destroyed']) {
            this.ref.detectChanges();
        }
    }

    ngOnDestroy() {
        if (this.commentFocusSub) {
            this.commentFocusSub.unsubscribe();
        }
        if (this.commentBtnSub) {
            this.commentBtnSub.unsubscribe();
        }
        if (this.dataLoadedSub) {
            this.dataLoadedSub.unsubscribe();
        }
    }

    onSubmit() {
        const comment = this.convertFormToComment(this.commentItem);
        this.commentSubmitted.emit(this.annotation);

        this.viewOnly();
    }

    onEdit() {
        this.editOnly();
    }

    onCancel() {
        this.renderer.setProperty(this.commentArea.nativeElement, 'value', this.comment.content);
        this.viewOnly();
    }

    viewOnly() {
        this.renderer.addClass(this.commentArea.nativeElement, 'view-mode');
        this.focused = false;
    }

    editOnly() {
        this.focused = true;
        this.renderer.removeClass(this.commentArea.nativeElement, 'view-mode');
    }

    isModified(): boolean {
        if (this.comment.createdDate === null) {
            return false;
        } else if (this.comment.lastModifiedBy === null) {
            return false;
        } else if (this.comment.createdDate === this.comment.lastModifiedDate) {
            return false;
        } else {
            return true;
        }
    }

    onBlur() {
        if (!this.ref['destroyed']) {
            this.ref.detectChanges();
        }
    }

    convertFormToComment(commentForm: NgForm): Comment {
        return new Comment(
            this.comment.id,
            this.comment.annotationId,
            null,
            null,
            new Date(),
            null,
            null,
            null,
            commentForm.value.content
        );
    }

    handleDeleteComment() {
        // this.annotationStoreService.deleteComment(this.comment.id);
    }

    handleCommentClick(event: any) {
        event.stopPropagation();
        // this.annotationStoreService.setCommentBtnSubject(this.comment.id);
        // this.annotationStoreService.setAnnotationFocusSubject(this.annotation);
    }

    handleShowBtn() {
        new Promise(resolve => {
            this.hideButton = false;
            this.expandComment();
            resolve('Success');
        }).then(() => {
            this.setHeight();
            setTimeout(() => {
                this.commentArea.nativeElement.focus();
            });
        });
    }

    handleHideBtn() {
        // new Promise(resolve => {
        //     if (!this.commentItem.value.content) {
        //         this.annotationStoreService.deleteComment(this.comment.id);
        //     }
        //     this.focused = false;
        //     this.hideButton = true;
        //     this.collapseComment();
        //     resolve('Success');
        // }).then(() => {
        //     this.setHeight();
        // });
    }

    collapseComment() {
        new Promise(resolve => {
            this.expandComment();
            resolve('Success');
        }).then(() => {
            if (!this.isCommentEmpty()) {
                this.shrinkComment();
            }
            this.renderer.addClass(this.commentArea.nativeElement, 'collapsed');
            this.renderer.removeClass(this.commentArea.nativeElement, 'expanded');
            this.renderer.addClass(this.detailsWrapper.nativeElement, 'collapsed');
            this.renderer.addClass(this.commentArea.nativeElement, 'view-mode');

            this.setHeight();
        });
    }

    isCommentEmpty(): boolean {
        return this.comment.content === null;
    }

    isShrinkable(): boolean {
        return this.commentArea.nativeElement.scrollHeight > 31;
    }

    shrinkComment() {
        if (this.isShrinkable()) {
            this.sliceComment = this.removeMultipleLines().slice(0, 20) + '...';
        }
    }

    removeMultipleLines(): string {
        return this.comment.content.split('\n').join(' ');
    }

    expandComment() {
        this.renderer.addClass(this.commentArea.nativeElement, 'expanded');
        this.renderer.removeClass(this.commentArea.nativeElement, 'collapsed');
        this.renderer.removeClass(this.detailsWrapper.nativeElement, 'collapsed');
        this.renderer.addClass(this.detailsWrapper.nativeElement, 'expanded');

        this.sliceComment = this.comment.content;
        this.setHeight();
    }


}
