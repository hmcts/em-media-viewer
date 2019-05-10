import { Component, Input, Renderer2, ViewChild, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { EmLoggerService } from '../../../logging/em-logger.service';
import { GenericOperation, RotateOperation, ZoomOperation } from '../../media-viewer.model';

@Component({
    selector: 'app-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent implements OnChanges {

  @Input() url: string;
  @Input() downloadFileName: string;
  @Input() originalUrl: string;
  @ViewChild('img') img: ElementRef;
  rotation = 0;

  @Input() rotateOperation: RotateOperation;
  @Input() zoomOperation: ZoomOperation;
  @Input() printOperation: GenericOperation;

  constructor(private renderer: Renderer2,
              private log: EmLoggerService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      let operation = changes[change].currentValue;
      if(operation && operation.action) {
        this[operation.action].call(this, operation);
      }
    }
  }

  rotate(operation: RotateOperation) {
      this.rotation = this.rotation + operation.rotation;
      this.rotateImage();
  }

  print() {
    const printWindow = window.open(this.url);
    printWindow.print();
  }

  rotateImage() {
      this.log.info('rotating to-' + this.rotation + 'degrees');
      const styles = ['transform', '-ms-transform', '-o-transform', '-moz-transform', '-webkit-transform'];
      for (const style of styles) {
          this.renderer.setStyle(this.img.nativeElement, style, `rotate(${this.rotation}deg)`);
      }
  }
}
