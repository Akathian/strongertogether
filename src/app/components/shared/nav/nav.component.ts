import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/auth'
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  width;
  uid
  constructor() { }

  ngOnInit() {
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      self.uid = user.uid
    })
    this.width = window.innerWidth
    window.addEventListener('resize', () => {
      self.width = window.innerWidth
    })
  }
}
