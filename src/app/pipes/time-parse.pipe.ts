import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeParse'
})
export class TimeParsePipe implements PipeTransform {

  transform(value: string): string {
    let time = +(value)
    let now = (new Date()).getTime()
    let diff = now - time
    if (diff < 30000) {
      return 'Just now'
    } else if (diff / 60000 < 60) {
      let num = Math.round(diff / 60000)
      if (num === 1) {
        return `${num}m ago`
      }
      return `${num}m ago`
    } else if ((diff / 60000) / 60 < 24) {
      let num = Math.round((diff / 60000) / 60)
      if (num === 1) {
        return `${num}h ago`
      }
      return `${num}h ago`
    } else if (((diff / 60000) / 60) / 24 < 7) {
      let num = Math.round(((diff / 60000) / 60) / 24)
      if (num === 1) {
        return `${num}d ago`
      }
      return `${num}d ago`
    } else {
      let d = new Date()
      d.setTime(time)
      let dateString = d.toDateString().substr(4)
      let year = dateString.substr(7)
      dateString = dateString.replace(' ' + year, ', ' + year)
      return dateString
    }
  }

}
