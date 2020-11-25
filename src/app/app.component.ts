import { Component, OnInit, HostListener } from '@angular/core';
import * as AOS from 'aos'
import * as $ from 'jquery'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'strongertogether';

  ngOnInit() {
    AOS.init();

    $(window).on('load', function () {
      AOS.refresh();
    });
    let scrollRef = 0;

    window.addEventListener('scroll', function () {

      scrollRef <= 10 ? scrollRef++ : AOS.refresh();
    });
    $(window).scroll(function () {
      console.log('hello')
    });
  }
}
