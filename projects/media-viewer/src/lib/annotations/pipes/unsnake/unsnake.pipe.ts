import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unsnake'
})
export class UnsnakePipe implements PipeTransform {

  transform(items: string): string {
    return items.split('_').join(' ');
  };

}
