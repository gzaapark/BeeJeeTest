import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value === 10 || value === 11)
      return `Выполнено (${value})`;
    else
      return `В работе (${value})`;;
  }

}
