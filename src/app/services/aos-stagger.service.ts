import { Injectable } from '@angular/core';
import * as $ from 'jquery'

@Injectable({
  providedIn: 'root'
})
export class AosStaggerService {

  constructor() { }

  stagger(between) {
    let delay = 0
    $('[data-aos]').each(function () {
      if ($(this).is(':visible')) {
        delay = delay + between;
        $(this).attr('data-aos-delay', delay);
      }
    });
  }
}
