import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readParse'
})
export class ReadParsePipe implements PipeTransform {

  transform(value: number): string {
    let time = Math.round(value)
    return `${time}m read`
  }

}
