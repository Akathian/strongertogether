import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  parser(time) {
    let d = new Date()
    d.setTime(time)
    let dateString = d.toDateString().substr(4)
    let year = dateString.substr(7)
    dateString = dateString.replace(' ' + year, ', ' + year)
    return dateString
  }
}
