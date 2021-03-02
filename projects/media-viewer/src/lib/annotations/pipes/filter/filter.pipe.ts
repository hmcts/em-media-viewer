import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string, fieldName: string): any[] {

    if (!items) {
      return [];
    }

    if (!searchText) {
      return items;
    }

    return items.filter(item => {
      if (item) {
        if (item[fieldName]) {
          return item[fieldName].toLowerCase().includes(searchText.toLowerCase());
        } else {
          return item.toLowerCase().includes(searchText.toLowerCase());
        }
      }
      return false;
    });
  }
}
