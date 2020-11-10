import { Component, Input, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

@Component({
  selector: 'app-blog-footer',
  templateUrl: './blog-footer.component.html',
  styleUrls: ['./blog-footer.component.scss'],
})
export class BlogFooterComponent implements OnInit {
  @Input() post;
  constructor() { }

  ngOnInit() {
    let self = this
    firebase.database().ref('blog/' + this.post.key).on('value', function (postData) {
      if (postData.val()) {
        self.post.value = postData.val()
        self.countComments()
        self.countViews()
        self.countLikes()
      }
    })
  }

  countComments() {
    let total = 0
    let b = []
    if (this.post.value.comments) {
      b = Object.values(this.post.value.comments)
      for (let comment of b) {
        if (comment.replies) {
          let c = Object.values(comment.replies)
          total += c.length
        }
        total += 1
      }
    }
    this.post.value.numComments = total
  }

  countViews() {
    if (this.post.value.views) {
      this.post.value.numViews = 0
      if (this.post.value.views) {
        let views = Object.keys(this.post.value.views)
        this.post.value.numViews = views.length
      }
    }
  }

  countLikes() {
    let self = this
    this.post.value.numLikes = 0
    if (this.post.value.likes) {
      let likes = Object.keys(this.post.value.likes)
      firebase.auth().onAuthStateChanged(function (user) {
        self.post.value.liked = likes.indexOf(user.uid) >= 0

      })
      this.post.value.numLikes = likes.length
    }
  }

  like(key) {
    firebase.auth().onAuthStateChanged(function (user) {
      let updates = {}
      updates['blog/' + key + '/likes/' + user.uid] = 1
      updates['users/' + user.uid + '/blog-likes/' + key] = key + '/likes/' + user.uid
      firebase.database().ref().update(updates)
    })
  }

  unlike(key) {
    firebase.auth().onAuthStateChanged(function (user) {
      firebase.database().ref('blog/' + key + '/likes/' + user.uid).remove()
      firebase.database().ref('users/' + user.uid + '/blog-likes/' + key).remove()
    })
  }
}
