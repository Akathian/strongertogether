import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.scss']
})
export class CountComponent implements OnInit {
  countDownDate = new Date('Jan 01, 2021 00:00:00').getTime();
  constructor() { }

  ngOnInit() {
    const self = this;
    setInterval(function () {
      const now = new Date().getTime();
      const timeleft = self.countDownDate - now;
      let days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
      let hours = Math.floor(
        (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

      document.getElementById('days').innerHTML = self.toDoubleDigit(days)
      document.getElementById('hours').innerHTML = self.toDoubleDigit(hours)
      document.getElementById('mins').innerHTML = self.toDoubleDigit(minutes)
      document.getElementById('secs').innerHTML = self.toDoubleDigit(seconds)
    }, 1000);
  }
  toDoubleDigit(num) {
    let ret = `${num}`
    if (ret.length === 1) {
      ret = '0' + ret
    }
    return `<h2 class='mx-auto my-0'>${ret}</h2>`
  }
}
