import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery'
@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss']
})
export class SlideshowComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  slides = [
    { img: "https://static.wixstatic.com/media/ef12a892bd33423cb11afc1f574efa4b.jpg/v1/fill/w_1231,h_821,al_c,q_85,usm_0.66_1.00_0.01/ef12a892bd33423cb11afc1f574efa4b.jpg" },
    { img: "https://static.wixstatic.com/media/634ae93ad10c49dc8cd89caad6b7406c.jpg/v1/fill/w_3998,h_2664,al_c,q_90,usm_0.66_1.00_0.01/634ae93ad10c49dc8cd89caad6b7406c.jpg" },
    { img: "https://static.wixstatic.com/media/54db4c322f9644b38ac9956285717c12.jpg/v1/fill/w_3998,h_2664,al_c,q_90,usm_0.66_1.00_0.01/54db4c322f9644b38ac9956285717c12.jpg" },
    { img: 'https://static.wixstatic.com/media/5b0263ea6cfc4dab9f3d3fcec87a8337.jpg/v1/fill/w_3998,h_2104,al_c,q_90,usm_0.66_1.00_0.01/5b0263ea6cfc4dab9f3d3fcec87a8337.jpg' }
  ];

  slideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "dots": true,
    "infinite": true,
    "autoplay": true,
    "autoplaySpeed": 3000
  };
}
