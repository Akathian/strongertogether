import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  parser(time) {
    let now = (new Date()).getTime()
    let diff = now - time
    if (diff < 30000) {
      return 'Just now'
    } else if (diff / 60000 < 60) {
      let num = Math.round(diff / 60000)
      if (num === 1) {
        return `${num} min ago`
      }
      return `${num} mins ago`
    } else if ((diff / 60000) / 60 < 24) {
      let num = Math.round((diff / 60000) / 60)
      if (num === 1) {
        return `${num} hr ago`
      }
      return `${num} hrs ago`
    } else if (((diff / 60000) / 60) / 24 < 7) {
      let num = Math.round(((diff / 60000) / 60) / 24)
      if (num === 1) {
        return `${num} day ago`
      }
      return `${num} days ago`
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
