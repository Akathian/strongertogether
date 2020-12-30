import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service'
import firebase from 'firebase/app'
import 'firebase/auth'
@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss']
})
export class QuoteComponent implements OnInit {
  loggedIn = false
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.renderAccInfo();
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        self.loggedIn = true
      }
    })
  }

}
