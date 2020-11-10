import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

@Component({
  selector: 'app-blog-likes',
  templateUrl: './blog-likes.component.html',
  styleUrls: ['./blog-likes.component.scss']
})
export class BlogLikesComponent implements OnInit {

  constructor() { }
  likesData;
  lenOfData;
  showLoading = true
  ngOnInit() {
    this.getBlogLikes()
  }

  getBlogLikes() {
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      firebase.database().ref('users/' + user.uid + '/blog-likes').on('value', async function (blogLikesData) {
        if (blogLikesData.val()) {
          let likeRefs = []
          self.likesData = {}
          likeRefs = Object.values(blogLikesData.val())
          self.lenOfData = likeRefs.length
          for (let like of likeRefs) {
            let title = await (await firebase.database().ref(like + '/title').once('value')).val()
            self.likesData[like] = { title, href: '/' + likeRefs }
          }
        }
        self.showLoading = false
      })
    })

  }
}
