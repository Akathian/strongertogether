import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  width;

  constructor() { }

  ngOnInit() {
    let self = this
    this.width = window.innerWidth
    window.addEventListener('resize', () => {
      self.width = window.innerWidth
    })
  }
}
