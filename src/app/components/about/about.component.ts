import { Component, OnInit } from '@angular/core';
import { AosStaggerService } from '../../services/aos-stagger.service'
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  width
  constructor(private staggerAos: AosStaggerService) { }

  ngOnInit() {
    let self = this
    this.width = window.innerWidth
    window.addEventListener('resize', () => {
      self.width = window.innerWidth
    })
    // this.staggerAos.stagger(200)
  }
}
