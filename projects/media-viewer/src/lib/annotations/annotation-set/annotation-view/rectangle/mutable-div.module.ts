import { NgModule } from '@angular/core';
import { DraggableElementDirective } from './draggable-element.directive';
import { ResizableElementDirective } from './resizable-element.directive';
import { ResizeHandlersComponent } from './resize-handlers/resize-handlers.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    DraggableElementDirective,
    ResizableElementDirective,
    ResizeHandlersComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DraggableElementDirective,
    ResizableElementDirective,
  ]
})
export class MutableDivModule { }
