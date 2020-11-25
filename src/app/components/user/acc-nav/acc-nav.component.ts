import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service'
import firebase from 'firebase/app'
import { ActivatedRoute, Router } from '@angular/router';

import 'firebase/database'
import 'firebase/auth'
@Component({
  selector: 'app-acc-nav',
  templateUrl: './acc-nav.component.html',
  styleUrls: ['./acc-nav.component.scss']
})
export class AccNavComponent implements OnInit {
  @Input() user;
  @Input() sections;
  width;
  isOwn = true;
  paramUid
  isAdmin = true
  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    let self = this
    this.width = window.innerWidth
    this.route.paramMap.subscribe(async params => {
      this.paramUid = params.get('uid')
    })
    window.addEventListener('resize', () => {
      self.width = window.innerWidth
    })
    firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        self.isOwn = user.uid === self.paramUid
        const admin = await (await firebase.database().ref('admins/' + self.paramUid).once('value')).val()
        self.isAdmin = admin ? true : false
      } else {
        // window.location.href = '/login'
      }
    })

  }

  signOut() {
    this.userService.signOut()
  }
}
