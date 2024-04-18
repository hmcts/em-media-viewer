import {
  OnInit,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  OnChanges,
  ViewContainerRef
} from '@angular/core';
import { ResizeHandlersComponent } from './resize-handlers/resize-handlers.component';

@Directive({
  selector: '[resizable]'
})
export class ResizableElementDirective implements OnInit, OnChanges {

  @Input() rotate = 0;
  @Input() selected = false;
  @Output() stopped = new EventEmitter();

  resizeHandlersComponent: ComponentRef<ResizeHandlersComponent>;

  constructor(private el: ElementRef,
              private container: ViewContainerRef,
              private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit(): void {
    this.addHandlersToElement();
  }

  ngOnChanges(): void {
    if (this.resizeHandlersComponent) {
      this.resizeHandlersComponent.instance.selected = this.selected;
      this.resizeHandlersComponent.instance.rotate = this.rotate;
    }
  }

  addHandlersToElement() {
    const component = this.componentFactoryResolver.resolveComponentFactory(ResizeHandlersComponent);
    this.resizeHandlersComponent = this.container.createComponent(component);
    this.resizeHandlersComponent.instance.parentElement = this.el;
    this.resizeHandlersComponent.instance.rotate = this.rotate;
    this.resizeHandlersComponent.instance.selected = this.selected;
    this.el.nativeElement.appendChild(this.resizeHandlersComponent.location.nativeElement);
  }

  @HostListener('pointerdown') onPointerDown() {
    this.resizeHandlersComponent.instance.selected = true;
  }

  @HostListener('pointerup') onPointerUp() {
    this.stopped.emit();
  }

  @HostListener('window:pointerup', ['$event.target']) onWindowPointerUp(targetEvent) {
    if (!this.el.nativeElement.contains(targetEvent)) {
      this.resizeHandlersComponent.instance.selected = false;
    }
  }
}
