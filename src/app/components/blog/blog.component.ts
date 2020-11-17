import { Component, OnInit } from '@angular/core';

import firebase from 'firebase/app'
import 'firebase/database'
import * as $ from 'jquery'
const OFFSET = 5
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  posts = [];
  userLiked;
  path;
  showLoading = true
  lenOfData
  offset = 5;
  page = 1;
  nextKey;
  nums = {
    general: 0,
    events: 0,
    podcasts: 0
  }
  pageKeys = {};
  numPages;
  constructor() { }

  ngOnInit() {
    this.path = window.location.pathname.replace('/blog', '').replace('-', '') || 'general'
    this.getNumPosts();
    this.getPosts()
  }

  getNumPosts() {
    let self = this
    firebase.database().ref('blog/num-' + this.path).on('value', function (numData) {
      self.nums[self.path] = numData.val()
      self.numPages = Math.ceil(self.nums[self.path] / OFFSET)
    })
  }

  getPosts() {
    let self = this
    let postQuery;
    console.log(this.nextKey, this.page)
    if (this.nextKey) {
      postQuery = firebase.database().ref('/blog/' + this.path).orderByKey().endAt(this.nextKey).limitToLast(OFFSET + 1)
    } else {
      postQuery = firebase.database().ref('/blog/' + this.path).orderByKey().limitToLast(OFFSET + 1)
    }
    postQuery.on('value', async function (blogData) {
      if (blogData.val()) {
        let toValues = Object.values(blogData.val())
        if (self.path !== 'general') {
          let refs = []
          if (self.page !== self.numPages) {
            if (!self.pageKeys[self.page + 1]) {
              self.nextKey = (<string>toValues.shift()).split('/')[2]
              self.pageKeys[self.page + 1] = self.nextKey
            } else {
              (<string>toValues.shift())
            }
          }
          refs = toValues.reverse()
          let posts = []
          for (let ref of refs) {
            let post = await (await firebase.database().ref(ref).once('value')).val()
            if (post) {
              posts.push(post)
            }
          }
          self.posts = posts
        } else {
          if (self.page !== self.numPages) {
            if (!self.pageKeys[self.page + 1]) {
              self.nextKey = (<any>toValues.shift()).id
              self.pageKeys[self.page + 1] = self.nextKey
            } else {
              (<any>toValues.shift())
            }
          }
          self.posts = toValues.reverse()
          self.lenOfData = self.posts.length
        }
      }
    })
  }


  newPost() {
    let d = (new Date()).getTime()
    let time = `${d}`
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        let postRef = firebase.database().ref('/users/' + user.uid + '/drafts').push()
        let postId = postRef.key
        postRef.set({
          authorImg: user.photoURL,
          authorName: user.displayName,
          comments: [],
          content: "<p>Set the title in the text input above. The first image attached in this post will be set as the cover. Main content of your blog post goes here </p>",
          cover: "<img width='100%' src='../../../assets/STNEWCOVER2.png'>",
          title: 'New Blog Post Title',
          readTime: "0",
          time: time,
          uid: user.uid,
          id: postId,
          category: 'general'
        })
        window.location.href = `/blog/drafts/${postId}/edit`;
      }
    })
  }

  goToPage(page) {
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
    $("body").scrollTop(0);
    this.getPosts()
  }
}
