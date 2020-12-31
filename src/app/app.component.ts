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
  released = new Date().getTime() >= new Date('Jan 01, 2021 00:00:00').getTime();
  config = {
    // // Global settings:
    // disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    // startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
    // initClassName: 'aos-init', // class applied after initialization
    // animatedClassName: 'aos-animate', // class applied on animation
    // useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
    // disableMutationObserver: false, // disables automatic mutations' detections (advanced)
    // debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    // throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
    // // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: 100, // offset (in px) from the original trigger point
    // delay: 0, // values from 0 to 3000, with step 50ms
    // duration: 400, // values from 0 to 3000, with step 50ms
    // easing: 'ease', // default easing for AOS animations
    once: true, // whether animation should happen only once - while scrolling down
    // mirror: false, // whether elements should animate out while scrolling past them
    // anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
  }
  ngOnInit() {
    AOS.init(this.config);
    $(window).on('load', function () {
      AOS.refresh(this.config);
    });
    let scrollRef = 0;
    let self = this
    window.addEventListener('scroll', function () {
      scrollRef <= 10 ? scrollRef++ : AOS.refresh(self.config);
    });

  }
}
