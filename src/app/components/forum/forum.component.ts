import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery'

const OFFSET = 5

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {
  posts;
  nums = {
    community: 0,
  }
  path = 'community'
  numPages
  nextKey
  pageKeys = {};
  page = 1;
  lenOfData
  id = 'createBtn'
  constructor(private router: Router, private route: ActivatedRoute,) { }

  ngOnInit() {
    let self = this
    this.getNumPosts()
    this.getPosts()
    window.addEventListener("click", function (event) {
      if (!(<HTMLElement>event.target).classList.contains('gearBtn')) {
        document.getElementById('createBtn').classList.remove("show");
      }
    });
  }

  getNumPosts() {
    let self = this
    firebase.database().ref("/num-" + this.path).on('value', function (numData) {
      self.nums[self.path] = numData.val()
      self.numPages = Math.ceil(self.nums[self.path] / OFFSET)
    })
  }


  getPosts() {
    let self = this
    let postQuery;

    if (this.nextKey) {
      postQuery = firebase.database().ref('/community').orderByKey().endAt(this.nextKey).limitToLast(OFFSET + 1)
    } else {
      postQuery = firebase.database().ref('/community').orderByKey().limitToLast(OFFSET + 1)
    }
    postQuery.once('value', async function (blogData) {
      if (blogData.val()) {
        let toValues = Object.values(blogData.val())
        if (self.page !== self.numPages && self.numPages > 0) {
          if (!self.pageKeys[self.page + 1]) {
            self.nextKey = (<any>toValues.shift()).id
            self.pageKeys[self.page + 1] = self.nextKey
          } else {
            (<any>toValues.shift())
          }
        }
        self.posts = toValues.reverse()
        for (let post of self.posts) {
          if (post) {
            post.gearData = {
              id: post.id,
              dbLink: 'community/' + post.id,
              editLink: '/community/post/' + post.id + '/edit',
              type: 'post',
              editors: [post.uid]
            }
          }
        }
        self.lenOfData = self.posts.length
      }
    })
  }
  myFunction() {
    document.getElementById('createBtn').classList.toggle("show");
  }

  newPost() {
    let d = (new Date()).getTime()
    let time = `${d}`
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        let postRef = firebase.database().ref('/users/' + user.uid + '/community-drafts').push()
        let postId = postRef.key
        postRef.set({
          authorImg: user.photoURL,
          authorName: user.displayName,
          comments: [],
          content: `This is your forum post`,
          title: 'New Forum Post Title',
          time: time,
          uid: user.uid,
          id: postId,
        }, function (err) {
          if (!err) {
            window.location.href = `/community/drafts/${postId}/edit`;
          }
        })
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
