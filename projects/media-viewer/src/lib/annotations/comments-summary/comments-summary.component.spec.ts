import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CommentsSummaryComponent } from './comments-summary.component';
import { PrintService } from '../../print.service';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { MomentDatePipe } from '../pipes/date/date.pipe';
import * as fromAnnoActions from '../../store/actions/annotation.actions';
import { SharedModule } from '../../shared/shared.module';
import { UnsnakePipe } from '../pipes/unsnake/unsnake.pipe';

describe('CommentsSummaryComponent', () => {
  let component: CommentsSummaryComponent;
  let fixture: ComponentFixture<CommentsSummaryComponent>;
  let printService: PrintService;
  const initialState = { 'media-viewer': {
      tags: {
        tagNameEnt: {
          tag1: ['a'],
          tag2: ['b'],
          tag3: ['c']
        }
      },
      annotations: {
        commentSummaryFilters: {hasFilter: false, filters: {} }
      },
      document: {
        pages: {}
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxDatatableModule,
        ReactiveFormsModule,
        RouterModule,
        SharedModule
      ],
      declarations: [ CommentsSummaryComponent, MomentDatePipe, UnsnakePipe ],
      providers: [ PrintService, provideMockStore({ initialState }), ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsSummaryComponent);
    component = fixture.componentInstance;
    printService = TestBed.inject(PrintService);

    fixture.detectChanges();
  });

  it('should set focus on container', () => {
    spyOn(component.container.nativeElement, 'focus');

    component.ngAfterViewInit();

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
    inject([ToolbarEventService],
      (toolbarEvents: ToolbarEventService) => {
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

  it('should dispatch ClearCommentSummaryFilters action and call buildCheckBoxForm when onClearFilters called',
    inject([Store], (store: Store<{}>) => {
      spyOn(store, 'dispatch').and.callThrough();
      spyOn(component, 'buildCheckBoxForm');
      const action = new fromAnnoActions.ClearCommentSummaryFilters();
      component.onClearFilters();

      expect(store.dispatch).toHaveBeenCalledWith(action);
      expect(component.buildCheckBoxForm).toHaveBeenCalled();
    })
  );

  describe('onFilter', () => {
    const mockTags = {
      tag1: false,
      tag2: false,
      tag3: false
    };

    it('should dispatch ApplyCommentSymmaryFilter with no dateRange filters',
      inject([Store], (store: Store<{}>) => {
        spyOn(store, 'dispatch').and.callThrough();
        const action = new fromAnnoActions.ApplyCommentSymmaryFilter({
          dateRangeTo: null,
          dateRangeFrom: null,
          tagFilters: { ...mockTags }
          });
        component.onFilter();

        expect(store.dispatch).toHaveBeenCalledWith(action);
      })
    );

    it('should dispatch ApplyCommentSymmaryFilter with dateRangeTo',
      inject([Store], (store: Store<{}>) => {
        const mockDate = { year: 2021, month: 1, day: 20 };
        component.filtersFg.patchValue({
          dateRangeTo: mockDate
        });

        spyOn(store, 'dispatch').and.callThrough();
        const action = new fromAnnoActions.ApplyCommentSymmaryFilter({
          dateRangeTo: new Date('2021-01-20T00:00:00').getTime(),
          dateRangeFrom: null, tagFilters: { ...mockTags }
        });
        component.onFilter();

        expect(store.dispatch).toHaveBeenCalledWith(action);
      })
    );

    it('should dispatch ApplyCommentSymmaryFilter with dateRangeFrom',
      inject([Store], (store: Store<{}>) => {
        const mockDate = { year: 2021, month: 1, day: 20 };
        component.filtersFg.patchValue({
          dateRangeFrom: mockDate
        });

        spyOn(store, 'dispatch').and.callThrough();
        const action = new fromAnnoActions.ApplyCommentSymmaryFilter({
          dateRangeFrom: new Date('2021-01-20T00:00:00').getTime(),
          dateRangeTo: null,
          tagFilters: { ...mockTags }
        });
        component.onFilter();

        expect(store.dispatch).toHaveBeenCalledWith(action);
      })
    );

    it('should dispatch ApplyCommentSymmaryFilter with dateRangeFrom and dateRangeTo',
      inject([Store], (store: Store<{}>) => {
        const mockDateFrom = { year: 2021, month: 1, day: 20 };
        const mockDateTo = { year: 2021, month: 2, day: 10 };

        component.filtersFg.patchValue({
          dateRangeFrom: mockDateFrom,
          dateRangeTo: mockDateTo
        });

        spyOn(store, 'dispatch').and.callThrough();
        const action = new fromAnnoActions.ApplyCommentSymmaryFilter({
          dateRangeFrom: new Date('2021-01-20T00:00:00').getTime(),
          dateRangeTo: new Date('2021-02-10T00:00:00').getTime(),
          tagFilters: { ...mockTags }
        });
        component.onFilter();

        expect(store.dispatch).toHaveBeenCalledWith(action);
      })
    );
  });

  it('should invert showFilters value when onFiltersToggle', () => {
    component.showFilters = false;
    component.onFiltersToggle();
    expect(component.showFilters).toBeTruthy();
  });
});
