import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
const OFFSET = 5

@Component({
  selector: 'app-forum-likes',
  templateUrl: './forum-likes.component.html',
  styleUrls: ['./forum-likes.component.scss']
})
export class ForumLikesComponent implements OnInit {

  constructor() { }
  likesData = {};
  likesDataVals
  lenOfData;
  showLoading = true
  user;
  nextKey
  ngOnInit() {
    this.authAndGetLikes()
  }

  authAndGetLikes() {
    let self = this
    if (this.user) {
      this.getBlogLikes(self, this.user)
    } else {
      firebase.auth().onAuthStateChanged(function (user) {
        self.user = user
        self.getBlogLikes(self, user)
      })
    }
  }

  getBlogLikes(self, user) {
    let ref
    if (self.nextKey) {
      ref = firebase.database().ref('users/' + user.uid + '/community-likes').orderByKey().endAt(self.nextKey).limitToLast(OFFSET + 1)
    } else {
      ref = firebase.database().ref('users/' + user.uid + '/community-likes').orderByKey().limitToLast(OFFSET + 1)
    }
    ref.on('value', async function (blogLikesData) {
      if (blogLikesData.val()) {
        let likeRefs = []
        likeRefs = Object.values(blogLikesData.val())
        self.lenOfData = likeRefs.length
        if (self.lenOfData > OFFSET) {
          self.nextKey = (<string>likeRefs.shift()).split('/').pop()
        }
        for (let like of likeRefs) {
          let title = await (await firebase.database().ref(like + '/title').once('value')).val()
          if (title) {
            // like = like.replace('community/', '')
            let href = like
            self.likesData[like] = { title, href }
          } else {
            firebase.database().ref('users/' + user.uid + '/community-likes/' + like.split('/')[1]).remove()
          }
        }
        self.likesDataVals = Object.keys(self.likesData).sort().reverse()
      }
      self.showLoading = false

    })

  }

  loadMore() {
    this.authAndGetLikes()
  }
}
