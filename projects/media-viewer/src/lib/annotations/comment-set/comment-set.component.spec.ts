import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentSetComponent } from './comment-set.component';

describe('CommentSetComponent', () => {
  let component: CommentSetComponent;
  let fixture: ComponentFixture<CommentSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
