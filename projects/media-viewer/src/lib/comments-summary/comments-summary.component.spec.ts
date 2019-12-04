import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import { CommentsSummaryComponent } from './comments-summary.component';
import { PrintService } from '../print.service';
import { ToolbarEventService } from '../toolbar/toolbar-event.service';

describe('CommentsSummaryComponent', () => {
  let component: CommentsSummaryComponent;
  let fixture: ComponentFixture<CommentsSummaryComponent>;
  let printService: PrintService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsSummaryComponent ],
      providers: [PrintService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsSummaryComponent);
    component = fixture.componentInstance;
    printService = TestBed.get(PrintService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('close', async(() => {
    inject([ToolbarEventService], (toolbarEvents: ToolbarEventService) => {
      spyOn(toolbarEvents, 'displayCommentSummary');
      component.onClose();
      expect(toolbarEvents.displayCommentSummary).toHaveBeenCalled();
    });
  }));

  it('print', () => {
    const printSpy = spyOn(printService, 'printElementNatively').and.stub();

    component.onPrint();

    expect(printSpy).toHaveBeenCalled();
  });

});
