import { Component, OnInit, HostListener } from '@angular/core';
import * as AOS from 'aos'
import * as $ from 'jquery'
import { AosStaggerService } from '../../services/aos-stagger.service'

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {

  constructor(private staggerAos: AosStaggerService) { }

  ngOnInit() {
    this.staggerAos.stagger(200)

  }

}
