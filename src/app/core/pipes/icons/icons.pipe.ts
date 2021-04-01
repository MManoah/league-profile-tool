import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'icons',
  pure: false
})
export class IconsPipe implements PipeTransform {

  transform(items: any[], filter: string): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => item.title.toLowerCase().indexOf(filter.toLowerCase()) !== -1 || item.id.toString().indexOf(filter) !== -1);
  }

}
