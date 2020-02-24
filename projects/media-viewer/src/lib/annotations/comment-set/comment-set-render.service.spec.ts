import { CommentSetRenderService } from './comment-set-render.service';
import { inject, TestBed } from '@angular/core/testing';
import { CommentComponent } from './comment/comment.component';

describe('CommentSetRenderService', () => {
  const componentList = [
    {
      page: 1,
      _rectangle: { x: 70, y: 30, height: 150, width: 200 },
      form: { nativeElement: {
          getBoundingClientRect: () =>  ({ height: 45 })
      }}
    },
    {
      page: 1,
      _rectangle: { x: 40, y: 60, height: 100, width: 250 },
      form: { nativeElement: {
        getBoundingClientRect: () => ({ height: 55 })
      }}
    }
  ] as CommentComponent[];

  const pageHeights = [1000, 1000, 1000];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommentSetRenderService]
    })
      .compileComponents();
  });

  it('should sort comment components, rotation 90',
    inject([CommentSetRenderService], (service: CommentSetRenderService) => {
      const commentList = [...componentList];

      service.sortComponents(commentList, pageHeights, 90, 1);

      expect(commentList[0].rectTop).toBe(40);
  }));

  it('should sort comment components, rotation 180',
    inject([CommentSetRenderService], (service: CommentSetRenderService) => {
      const commentList = [...componentList];

      service.sortComponents(commentList, pageHeights, 180, 1);

      expect(commentList[0].rectTop).toBe(840);
  }));

  it('should sort comment components, rotation 270',
    inject([CommentSetRenderService], (service: CommentSetRenderService) => {
      const commentList = [...componentList];

      service.sortComponents(commentList, pageHeights, 270, 1);

      expect(commentList[0].rectTop).toBe(710);
  }));

  it('should sort comment components, rotation 0',
    inject([CommentSetRenderService], (service: CommentSetRenderService) => {
      const commentList = [...componentList];

      service.sortComponents(commentList, pageHeights, 0, 1);

      expect(commentList[0].rectTop).toBe(60);
  }));

  it('should sort comment components, zoomed 200%',
    inject([CommentSetRenderService], (service: CommentSetRenderService) => {
      const commentList = [...componentList];

      service.sortComponents(commentList, pageHeights, 0, 2);

      expect(commentList[0].rectTop).toBe(60);
    }));


});
