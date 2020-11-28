import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  width
  constructor() { }

  ngOnInit() {
    let self = this
    this.width = window.innerWidth
    window.addEventListener('resize', () => {
      self.width = window.innerWidth
    })
  }

}
