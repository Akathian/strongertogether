import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service'
import { MessengerService } from '../../services/messenger.service'
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user;
  userLoggedIn = true;
  section = 'profile';
  sections = [
    { name: 'Profile', id: 'profile' },
    { name: 'Bookings', id: 'bookings' },
    { name: 'Blog Posts', id: 'blog-posts' },
    { name: 'Blog Comments', id: 'blog-comments' },
    { name: 'Blog Likes', id: 'blog-likes' },
    { name: 'Drafts', id: 'drafts' },
    { name: 'Forum Posts', id: 'forum-posts' },
    { name: 'Forum Comments', id: 'forum-comments' },
  ]
  paramUid;
  constructor(private userService: UserService, private messenger: MessengerService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    let self = this
    this.userService.renderAccInfo();
    firebase.auth().onAuthStateChanged(function (user) {
      self.userLoggedIn = user ? true : false
      self.user = user
    })
    this.route.paramMap.subscribe(async params => {
      this.section = params.get('section');
      this.paramUid = params.get('uid')
      if (this.section && this.validateSection(this.section)) {
        for (let i = 0; i < document.getElementsByClassName('accNavElem').length; i++) {
          (<HTMLElement>document.getElementsByClassName('accNavElem')[i]).style.color = 'black'
        }
        if (document.getElementById(this.section)) {
          document.getElementById(this.section).style.color = '#80a0bd'
        }
      } else {
        this.section = 'profile'
        this.router.navigate(['/user/' + this.paramUid + '/profile'], { relativeTo: this.route })
      }
    });
  }

  validateSection(section) {
    for (let page of this.sections) {
      if (section === page.id) {
        return true
      }
    }
    return false
  }
}
