import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value == 1)
      return 'отредактирована администратором';
    else if (value == 10)
      return 'выполнена';
    else if (value == 11)
      return 'выполнена, отредактирована администратором';
    else
      return 'не выполнена';
  }

}
