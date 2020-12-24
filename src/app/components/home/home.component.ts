import { Component, OnInit } from '@angular/core';
import { AosStaggerService } from '../../services/aos-stagger.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private staggerAos: AosStaggerService) { }


  ngOnInit() {
    this.staggerAos.stagger(200)
  }

}
