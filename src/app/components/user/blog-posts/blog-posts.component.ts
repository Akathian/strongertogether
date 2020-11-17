import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

const OFFSET = 15;
@Component({
  selector: 'app-blog-posts',
  templateUrl: './blog-posts.component.html',
  styleUrls: ['./blog-posts.component.scss']
})
export class BlogPostsComponent implements OnInit {
  posts
  postsData = [];
  showLoading = true
  lenOfData = 0;
  nextKey;
  pageKeys = {}
  page = 1
  user
  numPages
  constructor() { }

  ngOnInit() {
    this.authAndGetPosts()
  }

  getNumPosts(self) {
    firebase.database().ref('users/' + self.user.uid + '/num-blog-posts').on('value', function (numData) {
      self.numPages = Math.ceil(numData.val() / OFFSET)
    })
  }

  authAndGetPosts() {
    let self = this
    if (!this.user) {
      firebase.auth().onAuthStateChanged(function (user) {
        self.user = user
        self.getNumPosts(self);
        self.getPosts(self)
      })
    } else {
      this.getNumPosts(self);
      this.getPosts(self)
    }
  }

  getPosts(self) {
    let postQuery
    if (self.nextKey) {
      postQuery = firebase.database().ref('users/' + self.user.uid + '/blog-posts').orderByKey().endAt(this.nextKey).limitToLast(OFFSET + 1)
    } else {
      postQuery = firebase.database().ref('users/' + self.user.uid + '/blog-posts').orderByKey().limitToLast(OFFSET + 1)
    }
    postQuery.on('value', async function (postData) {
      if (postData.val()) {
        self.posts = postData.val()
        let postRefs = []
        postRefs = Object.values(self.posts)
        self.lenOfData = postRefs.length
        if (self.page !== self.numPages) {
          if (!self.pageKeys[self.page + 1]) {
            self.nextKey = (<string>postRefs.shift()).split('/')[2]
            self.pageKeys[self.page + 1] = self.nextKey
          } else {
            (<string>postRefs.shift())
          }
        }
        postRefs = postRefs.reverse()
        self.postsData = []
        for (let post of postRefs) {
          let fullPost = await firebase.database().ref(post).once('value')
          if (fullPost.val()) {
            post = post.replace('blog/', '')
            self.postsData.push(fullPost.val())
          }
        }
      }
      self.showLoading = false

    })
  }

  goToPage(page) {
    this.showLoading = true
    if (page < 1) {
      page = 1
    }
    if (page > this.numPages) {
      page = this.numPages
    }
    this.page = page
    if (this.pageKeys[this.page]) {
      this.nextKey = this.pageKeys[this.page]
    }
    if (this.page === 1) {
      this.nextKey = ''
    }
    this.authAndGetPosts()
  }
}
