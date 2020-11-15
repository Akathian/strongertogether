import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

const OFFSET = 5;
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
  constructor() { }

  ngOnInit() {
    this.authAndGetPosts()
  }

  authAndGetPosts() {
    let self = this
    if (!this.user) {
      firebase.auth().onAuthStateChanged(function (user) {
        self.user = user
        self.getPosts(self)
      })
    } else {
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
        if (self.lenOfData > OFFSET) {
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
          } else {
            firebase.database().ref("users/" + self.user.uid + '/' + post.replace('blog/general/', 'blog-posts/')).remove()
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
      return
    }
    if (this.lenOfData < OFFSET) {
      // page -= 1
      // return
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
