import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { CommentsSummaryComponent } from './comments-summary.component';
import { PrintService } from '../../print.service';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { ViewerEventService } from '../../viewers/viewer-event.service';
import { MomentDatePipe } from '../pipes/date.pipe';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers/reducers';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { UnsnakePipe } from '../pipes/unsnake.pipe';

describe('CommentsSummaryComponent', () => {
  let component: CommentsSummaryComponent;
  let fixture: ComponentFixture<CommentsSummaryComponent>;
  let printService: PrintService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxDatatableModule,
        ReactiveFormsModule,
        RouterModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('media-viewer', reducers),
        SharedModule
      ],
      declarations: [ CommentsSummaryComponent, MomentDatePipe, UnsnakePipe ],
      providers: [ PrintService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsSummaryComponent);
    component = fixture.componentInstance;
    printService = TestBed.get(PrintService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set focus on container', () => {
    spyOn(component.container.nativeElement, 'focus');

    component.ngOnInit();

    expect(component.container.nativeElement.focus).toHaveBeenCalled();
  });

  it('close',
    inject([ToolbarEventService], (toolbarEvents: ToolbarEventService) => {
      spyOn(toolbarEvents, 'toggleCommentsSummary');
      component.onClose();
      expect(toolbarEvents.toggleCommentsSummary).toHaveBeenCalledWith(false);
    })
  );

  it('print', () => {
    const printSpy = spyOn(printService, 'printElementNatively').and.stub();
    component.onPrint();

    expect(printSpy).toHaveBeenCalled();
  });

  it('should set the page if the content type is pdf',
    inject([ToolbarEventService], (toolbarEvents: ToolbarEventService) => {
      spyOn(toolbarEvents, 'setPage');

      component.contentType = 'pdf';
      component.navigateToPage(4);

      expect(toolbarEvents.setPage).toHaveBeenCalledWith(4);
    })
  );

  it('should not set the page if the content type is not pdf',
    inject([ToolbarEventService], (toolbarEvents: ToolbarEventService) => {
      spyOn(toolbarEvents, 'setPage');

      component.contentType = 'image';
      component.navigateToPage(1);

      expect(toolbarEvents.setPage).toHaveBeenCalledTimes(0);
    })
  );

  it('should toggle the display comment summary state',
    inject([ToolbarEventService, ViewerEventService],
      (toolbarEvents: ToolbarEventService, viewerEvents: ViewerEventService) => {
      spyOn(toolbarEvents, 'setPage');
      spyOn(toolbarEvents, 'toggleCommentsSummary');
      spyOn(toolbarEvents, 'toggleCommentsPanel');
      component.contentType = 'pdf';

      component.navigateToPage(4);

      expect(toolbarEvents.setPage).toHaveBeenCalled();
      expect(toolbarEvents.toggleCommentsSummary).toHaveBeenCalledWith(false);
      expect(toolbarEvents.toggleCommentsPanel).toHaveBeenCalledWith(true);
    })
  );
});
