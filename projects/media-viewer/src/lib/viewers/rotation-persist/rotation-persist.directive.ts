import { Directive, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import * as fromDocumentActions from '../../store/actions/document.action';
import { select, Store } from '@ngrx/store';
import * as fromDocuments from '../../store/selectors/document.selectors';
import { filter, take } from 'rxjs/operators';
import { Rotation } from './rotation.model';
import { ResponseType } from '../viewer-exception.model';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import * as fromStore from '../../store/reducers/reducers';
import { ToolbarButtonVisibilityService } from '../../toolbar/toolbar-button-visibility.service';
import { Subscription } from 'rxjs';


@Directive({
  selector: '[rotationPersist]'
})
export class RotationPersistDirective implements OnInit, OnDestroy {

  documentId: string;
  rotation = 0;
  savedRotation = 0;

  $subscriptions: Subscription;

  constructor(private el: ElementRef,
              private store: Store<fromStore.DocumentState>,
              public readonly toolbarButtons: ToolbarButtonVisibilityService,
              private toolbarEvents: ToolbarEventService) {
  }

  ngOnInit() {
    this.$subscriptions = this.toolbarEvents.rotateSubject.subscribe(rotation => this.onRotate(rotation));
    this.$subscriptions
      .add(this.toolbarEvents.saveRotationSubject.subscribe(() => this.saveRotation()))
      .add(this.store.pipe(select(fromDocuments.getRotation))
        .subscribe(rotation => this.savedRotation = rotation))
      .add(this.store.pipe(select(fromDocuments.getDocumentId))
        .subscribe(documentId => this.documentId = documentId));
  }

  ngOnDestroy() {
    this.$subscriptions.unsubscribe();
  }

  @HostListener('mediaLoadStatus', ['$event'])
  onMediaLoad(status: ResponseType) {
    this.rotation = 0;
    this.store.dispatch(new fromDocumentActions.LoadRotation(this.documentId));
    this.store.pipe(select(fromDocuments.rotationLoaded),
      filter(value => !!value),
      take(1))
      .subscribe(() => {
        if (this.savedRotation) {
          this.toolbarEvents.rotateSubject.next(this.savedRotation);
        }
      })
  }

  private onRotate(rotation: number) {
    this.rotation = (this.rotation + rotation) %360;
    this.toolbarButtons.showSaveRotationButton = this.savedRotation !== this.rotation;
  }

  private saveRotation() {
    const payload: Rotation = {
      documentId: this.documentId,
      rotationAngle: this.rotation
    }
    this.store.dispatch(new fromDocumentActions.SaveRotation(payload));
  }
}
