import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service'
import firebase from 'firebase/app'
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
  constructor(private userService: UserService) { }

  ngOnInit() {
    let self = this
    this.width = window.innerWidth
    window.addEventListener('resize', () => {
      self.width = window.innerWidth
    })
    
  }

  signOut() {
    this.userService.signOut()
  }
}
