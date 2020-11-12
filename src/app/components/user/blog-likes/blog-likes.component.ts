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
            if (title) {
              self.likesData[like] = { title, href: '/' + likeRefs }
            } else {
              console.log('users/' + user.uid + '/blog-likes/' + like.split('/')[2])
              firebase.database().ref('users/' + user.uid + '/blog-likes/' + like.split('/')[2]).remove()
            }
          }
        }
        self.showLoading = false
      })
    })

  }
}
