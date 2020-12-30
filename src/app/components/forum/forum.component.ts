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
  pinnedPosts = [];
  isAdmin = false

  constructor(private router: Router, private route: ActivatedRoute,) { }

  ngOnInit() {
    let self = this
    this.getNumPosts()
    this.getPosts()
    this.getPins();
    this.checkAdmin()

  }

  checkAdmin() {
    let self = this
    firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        const admin = await (await firebase.database().ref('admins/' + user.uid).once('value')).val()
        self.isAdmin = admin ? true : false
      }
    })
  }


  getPins() {
    let self = this
    firebase.database().ref('community-pinned').on('value', async function (pinData) {
      if (pinData.val()) {
        self.pinnedPosts = []
        let pinnedRefs = []
        pinnedRefs = Object.values(pinData.val()).reverse()
        for (let ref of pinnedRefs) {
          let pinnedPost = await (await firebase.database().ref(ref).once('value')).val()
          if (pinnedPost) {
            try {
              pinnedPost.numComments = Object.keys(pinnedPost.comments).length
            } catch (e) {
              pinnedPost.numComments = 0
            }
            try {
              pinnedPost.numLikes = Object.keys(pinnedPost.likes).length

            } catch (e) {
              pinnedPost.numLikes = 0
            } try {
              pinnedPost.numViews = Object.keys(pinnedPost.views).length

            } catch (e) {
              pinnedPost.numViews = 0
            }
            self.pinnedPosts.push(pinnedPost)
          } else {
            firebase.database().ref(ref).remove()
          }
        }
      } else {
        self.pinnedPosts = []
      }
    })
  }

  pin(postId) {
    firebase.database().ref('community-pinned/' + postId).set('community/' + postId)
    firebase.database().ref('community/' + postId + '/pinned').set('true')

  }

  unpin(postId) {
    firebase.database().ref('community-pinned/' + postId).remove()
    firebase.database().ref('community/' + postId + '/pinned').set(null)

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
            try {
              post.numComments = Object.keys(post.comments).length
            } catch (e) {
              post.numComments = 0
            }
            try {
              post.numLikes = Object.keys(post.likes).length

            } catch (e) {
              post.numLikes = 0
            } try {
              post.numViews = Object.keys(post.views).length

            } catch (e) {
              post.numViews = 0
            }

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
