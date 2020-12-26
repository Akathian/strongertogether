import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import { ActivatedRoute, Router } from '@angular/router';
const OFFSET = 5

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {
  posts;
  nums;
  path
  numPages
  nextKey
  pageKeys
  page
  lenOfData
  id = 'createBtn'
  constructor(private router: Router, private route: ActivatedRoute,) { }

  ngOnInit() {
    let self = this
    window.addEventListener("click", function (event) {
      if (!(<HTMLElement>event.target).classList.contains('gearBtn')) {
        document.getElementById('createBtn').classList.remove("show");
      }
    });
    this.getNumPosts()
    this.getPosts()

  }
  getNumPosts() {
    let self = this
    firebase.database().ref("num-community").on('value', function (numData) {
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
}
