import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsSummaryComponent } from './comments-summary.component';
import { PrintService } from '../print.service';
import { Subject } from 'rxjs';

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
    component.showCommentSummary = new Subject<boolean>();
    component.showCommentSummary.subscribe(value => {
      expect(value).toEqual(false);
    });

    component.onClose();
  }));

  it('print', () => {
    const printSpy = spyOn(printService, 'printElementNatively').and.stub();

    component.onPrint();

    expect(printSpy).toHaveBeenCalled();
  });

});
