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
    { name: 'Biography', id: 'profile' },
    { name: 'Bookings', id: 'bookings' },
    { name: 'Blog Posts', id: 'blog-posts' },
    { name: 'Blog Comments', id: 'blog-comments' },
    { name: 'Blog Likes', id: 'blog-likes' },
    // { name: 'Drafts', id: 'drafts' },
    // { name: 'Community Posts', id: 'community-posts' },
    { name: 'Community Comments', id: 'user-community-comments' },
    { name: 'Commmunity Likes', id: 'community-likes' },
    { name: 'Community Drafts', id: 'community-drafts' },

  ]
  paramUid;
  username;
  currPath
  constructor(private userService: UserService, private messenger: MessengerService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    let self = this
    this.userService.renderAccInfo();
    this.route.paramMap.subscribe(async params => {

      this.section = params.get('section');
      this.paramUid = params.get('uid')
      // console.log(this.section)

      if (this.validateSection(this.section)) {
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
    firebase.auth().onAuthStateChanged(async function (user) {
      self.userLoggedIn = user ? true : false
      let uid
      if (user) {
        uid = user.uid
        self.username = user.displayName
        self.currPath = window.location.pathname
        if (await (await firebase.database().ref('admins/' + user.uid).once('value')).val()) { // i am admin
          self.sections = [
            { name: 'Biography', id: 'profile' },
            // { name: 'Bookings', id: 'bookings' },
            { name: 'Blog Posts', id: 'blog-posts' },
            { name: 'Blog Comments', id: 'blog-comments' },
            { name: 'Blog Likes', id: 'blog-likes' },
            { name: 'Blog Drafts', id: 'drafts' },
            // { name: 'Forum Posts', id: 'forum-posts' },

            { name: 'Commmunity Comments', id: 'user-community-comments' },
            { name: 'Commmunity Likes', id: 'community-likes' },
            { name: 'Community Drafts', id: 'community-drafts' },
          ]
        } else {
          self.sections = [
            { name: 'Biography', id: 'profile' },
            { name: 'Bookings', id: 'bookings' },
            { name: 'Blog Comments', id: 'blog-comments' },
            { name: 'Blog Likes', id: 'blog-likes' },
            // { name: 'Forum Posts', id: 'forum-posts' },
            { name: 'Commmunity Comments', id: 'user-community-comments' },
            { name: 'Commmunity Likes', id: 'community-likes' },
          ]
        }
      }
      self.user = uid === self.paramUid ? user : await self.userService.getUserByUid(self.paramUid)
      if (self.user !== user && self.user !== '') {
        if (await (await firebase.database().ref('admins/' + self.user.uid).once('value')).val()) { // person is admin (not me)
          if (await (await firebase.database().ref('admins/' + user.uid).once('value')).val()) { // i am admin
            self.sections = [
              { name: 'Biography', id: 'profile' },
              { name: 'Blog Posts', id: 'blog-posts' },
              { name: 'Blog Comments', id: 'blog-comments' },
              { name: 'Blog Likes', id: 'blog-likes' },
              // { name: 'Forum Posts', id: 'forum-posts' },
              { name: 'Commmunity Comments', id: 'user-community-comments' },
              { name: 'Commmunity Likes', id: 'community-likes' },
            ]
          } else {
            self.sections = [
              { name: 'Biography', id: 'profile' },
              { name: 'Blog Posts', id: 'blog-posts' },
              { name: 'Blog Comments', id: 'blog-comments' },
              // { name: 'Forum Posts', id: 'forum-posts' },
              { name: 'Commmunity Comments', id: 'user-community-comments' },
              // { name: 'Commmunity Likes', id: 'community-likes' },
            ]
          }
        } else {
          if (await (await firebase.database().ref('admins/' + user.uid).once('value')).val()) { // i am admin
            self.sections = [
              { name: 'Biography', id: 'profile' },
              { name: 'Blog Comments', id: 'blog-comments' },
              { name: 'Blog Likes', id: 'blog-likes' },
              // { name: 'Forum Posts', id: 'forum-posts' },
              { name: 'Commmunity Comments', id: 'user-community-comments' },
              { name: 'Commmunity Likes', id: 'community-likes' },
            ]
          } else {
            self.sections = [
              { name: 'Biography', id: 'profile' },
              { name: 'Blog Comments', id: 'blog-comments' },
              // { name: 'Forum Posts', id: 'forum-posts' },
              { name: 'Commmunity Comments', id: 'user-community-comments' },
              // { name: 'Commmunity Likes', id: 'community-likes' },
            ]
          }
        }
        self.validateSection(self.section)
      } else if (self.user === '') {
        self.user = user
        self.router.navigate(['/user/' + uid + '/profile'], { relativeTo: self.route })
      }
    })

  }


  validateSection(section) {
    for (let page of this.sections) {
      if (section === page.id) {
        return true
      }
    }
    this.section = 'profile'
    this.router.navigate(['/user/' + this.paramUid + '/profile'], { relativeTo: this.route })
  }
}
