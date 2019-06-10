import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsSummaryComponent } from './comments-summary.component';
import { PrintService } from '../print.service';

describe('CommentsSummaryComponent', () => {
  let component: CommentsSummaryComponent;
  let fixture: ComponentFixture<CommentsSummaryComponent>;

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

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
