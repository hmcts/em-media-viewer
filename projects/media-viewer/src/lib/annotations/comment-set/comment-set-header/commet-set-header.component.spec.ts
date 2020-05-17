import { ComponentFixture, TestBed } from '@angular/core/testing';
import {CommentSetHeaderComponent} from './comment-set-header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {StoreModule} from '@ngrx/store';
import {reducers} from '../../../store/reducers/reducers';

describe('CommentSetHeader', () => {
  let component: CommentSetHeaderComponent;
  let fixture: ComponentFixture<CommentSetHeaderComponent>;
  let nativeElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.forFeature('media-viewer', reducers),
        StoreModule.forRoot({})],
      declarations: [CommentSetHeaderComponent],
      providers: [

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentSetHeaderComponent);
    nativeElement = fixture.debugElement.nativeElement;
    component = fixture.componentInstance;
    component.showCommentSummary = true;
    component.tabSelected = 'comments';
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should emit toggleCommentsSummary event', () => {
    const commentSummarySpy = spyOn(component.showCommentSummaryDialog, 'emit');
    const commentSummaryButton = nativeElement.querySelector('#commentSummary');

    commentSummaryButton.click();

    expect(commentSummarySpy).toHaveBeenCalled();
  });
});
