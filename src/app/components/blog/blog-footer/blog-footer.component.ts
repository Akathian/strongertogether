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
  numViews;
  numComments;
  numLikes;
  liked = false
  constructor() { }

  ngOnInit() {
    let self = this
    firebase.database().ref('blog/general/' + this.post.id).on('value', function (postData) {
      if (postData.val()) {
        self.post = postData.val()
        self.countComments()
        self.countViews()
        self.countLikes()
      }
    })
  }

  countComments() {
    let total = 0
    let b = []
    if (this.post.comments) {
      b = Object.values(this.post.comments)
      for (let comment of b) {
        if (comment.replies) {
          let c = Object.values(comment.replies)
          total += c.length
        }
        total += 1
      }
    }
    this.numComments = total
  }

  countViews() {
    this.numViews = 0
    if (this.post.views) {
      let views = Object.keys(this.post.views)
      this.numViews = views.length
    }
  }

  countLikes() {
    let self = this
    this.numLikes = 0
    if (this.post.likes) {
      let likes = Object.keys(this.post.likes)
      firebase.auth().onAuthStateChanged(function (user) {
        self.liked = likes.indexOf(user.uid) >= 0
      })
      this.numLikes = likes.length
    } else {
      this.liked = false
    }
  }

  like(key) {
    firebase.auth().onAuthStateChanged(function (user) {
      let updates = {}
      updates['blog/general/' + key + '/likes/' + user.uid] = 1
      updates['users/' + user.uid + '/blog-likes/' + key] = "blog/general/" + key
      firebase.database().ref().update(updates)
    })
  }

  unlike(key) {
    firebase.auth().onAuthStateChanged(function (user) {
      firebase.database().ref('blog/general/' + key + '/likes/' + user.uid).remove()
      firebase.database().ref('users/' + user.uid + '/blog-likes/' + key).remove()
    })
  }
}
