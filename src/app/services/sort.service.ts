import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortService {

  constructor() { }

  sort(option, arr) {
    let sortFn;
    switch(option) {
      case 'newest': {
        sortFn = (a, b) => {
          const c = +(b.time) - +(a.time);
          return c;
        };
        break;
      }
      case 'oldest': {
        sortFn = (a, b) => {
          const c = +(a.time) - +(b.time);
          return c;
        };
        break;
      }
    }
    return arr.sort(sortFn)
  }
}
