import { Component, OnInit } from '@angular/core';

import firebase from 'firebase/app'
import 'firebase/database'

const OFFSET = 3
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  posts = [];
  paginated = []
  userLiked;
  path;
  showLoading = true
  lenOfData
  offset = 5;
  page = 0;
  numPages;
  constructor() { }

  ngOnInit() {
    this.path = window.location.pathname.replace('/blog', '').replace('-', '') || 'general'
    console.log(this.path)
    this.getPosts()
  }

  getPosts() {
    let self = this
    firebase.database().ref('/blog/' + this.path).on('value', async function (blogData) {
      if (blogData.val()) {
        if (self.path !== 'general') {
          let refs = []
          refs = Object.values(blogData.val()).reverse()
          let posts = []
          for (let ref of refs) {
            let post = await (await firebase.database().ref(ref).once('value')).val()
            posts.push(post)
          }
          self.posts = posts
          console.log(self.posts)

        } else {
          self.posts = Object.values(blogData.val()).reverse()
          self.lenOfData = self.posts.length
          self.chunk(self.posts)
        }
      }
    })
  }

  chunk(items) {
    var i, j, chunk = OFFSET;
    let temparray = []
    for (i = 0, j = items.length; i < j; i += chunk) {
      temparray = items.slice(i, i + chunk);
      this.paginated.push(temparray)
      this.showLoading = false;
    }
    this.numPages = Array(this.paginated.length).fill(0).map((x, i) => i); // [4,4,4,4,4]
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
    if (page < 0) {
      page = 0
    }
    if (page > this.paginated.length - 1) {
      page = this.paginated.length - 1
    }
    this.page = page
  }
}
