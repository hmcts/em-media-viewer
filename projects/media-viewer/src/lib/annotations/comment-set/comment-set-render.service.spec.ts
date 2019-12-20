import { CommentSetRenderService } from './comment-set-render.service';
import { inject, TestBed } from '@angular/core/testing';
import { CommentComponent } from './comment/comment.component';
import { AnnotationService } from '../annotation.service';


describe('AnnotationService', () => {
  const componentList = [
    {
      _rectangle: { x: 70, y: 30, height: 150, width: 200 },
      form: { nativeElement: {
          getBoundingClientRect: () =>  ({ height: 45 })
      }}
    },
    {
      _rectangle: { x: 40, y: 60, height: 100, width: 250 },
      form: { nativeElement: {
        getBoundingClientRect: () => ({ height: 55 })
      }}
    }
  ] as CommentComponent[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommentSetRenderService]
    })
      .compileComponents();
  });

  it('should sort comment components, rotation 90',
    inject([CommentSetRenderService], (service: CommentSetRenderService) => {
      const commentList = [...componentList];
      service.sortComponents(commentList, 100, 90);

      expect(commentList[0].rectTop).toBe(40);
  }));

  it('should sort comment components, rotation 180',
    inject([CommentSetRenderService], (service: CommentSetRenderService) => {
      const commentList = [...componentList];

      service.sortComponents(commentList, 100, 180);

      expect(commentList[0].rectTop).toBe(-60);
  }));

  it('should sort comment components, rotation 270',
    inject([CommentSetRenderService], (service: CommentSetRenderService) => {
      const commentList = [...componentList];

      service.sortComponents(commentList, 100, 270);

      expect(commentList[0].rectTop).toBe(-190);
  }));

  it('should sort comment components, rotation 0',
    inject([CommentSetRenderService], (service: CommentSetRenderService) => {
      const commentList = [...componentList];

      service.sortComponents(commentList, 100, 0);

      expect(commentList[0].rectTop).toBe(60);
  }));

});
