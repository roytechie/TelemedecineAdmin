import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    //return null;
    if (!value) {
      return value;
    }
    // filter items array, items which match and return true will be
   // kept, false will be filtered out
    debugger;
    return value.filter(item => item.isActiveLicense == args[0]);
  }

}
