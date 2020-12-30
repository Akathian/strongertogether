import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

const OFFSET = 5;
@Component({
  selector: 'app-forum-posts',
  templateUrl: './forum-posts.component.html',
  styleUrls: ['./forum-posts.component.scss']
})
export class ForumPostsComponent implements OnInit {
  posts
  postsData = [];
  showLoading = true
  lenOfData = 0;
  nextKey;
  pageKeys = {}
  page = 1
  user
  numPages
  paramUid

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.authAndGetPosts()
    this.route.paramMap.subscribe(async params => {
      this.paramUid = params.get('uid')
    })
  }

  async getNumPosts(self) {
    const numData = await (await firebase.database().ref('users/' + self.user.uid + '/num-community-posts').once('value')).val()
    self.numPages = Math.ceil(numData / OFFSET)

  }

  async authAndGetPosts() {
    let self = this
    if (!this.user) {
      firebase.auth().onAuthStateChanged(async function (user) {
        self.user = user.uid === self.paramUid ? user : await self.userService.getUserByUid(self.paramUid)
        if (self.user === '') {
          self.user = user
        }
        await self.getNumPosts(self);
        self.getPosts(self)
      })
    } else {
      await this.getNumPosts(self);
      this.getPosts(self)
    }
  }

  getPosts(self) {
    let postQuery
    if (self.nextKey) {
      postQuery = firebase.database().ref('users/' + self.user.uid + '/community-posts').orderByKey().endAt(this.nextKey).limitToLast(OFFSET + 1)
    } else {
      postQuery = firebase.database().ref('users/' + self.user.uid + '/community-posts').orderByKey().limitToLast(OFFSET + 1)
    }
    postQuery.on('value', async function (postData) {
      if (postData.val()) {
        self.posts = postData.val()
        let postRefs = []
        self.postsData = []

        postRefs = Object.values(self.posts)
        self.lenOfData = postRefs.length
        if (self.page !== self.numPages) {
          if (!self.pageKeys[self.page + 1]) {
            self.nextKey = (<string>postRefs.shift()).split('/')[1]
            self.pageKeys[self.page + 1] = self.nextKey
          } else {
            (<string>postRefs.shift())
          }
        }
        postRefs = postRefs.reverse()
        for (let post of postRefs) {
          let fullPost = await firebase.database().ref(post).once('value')
          if (fullPost.val()) {
            // post = post.replace('community/', '')
            let fullPostVal = fullPost.val()
            try {
              fullPostVal.numComments = Object.keys(fullPostVal.comments).length
            } catch (e) {
              fullPostVal.numComments = 0
            }
            try {
              fullPostVal.numLikes = Object.keys(fullPostVal.likes).length

            } catch (e) {
              fullPostVal.numLikes = 0
            } try {
              fullPostVal.numViews = Object.keys(fullPostVal.views).length

            } catch (e) {
              fullPostVal.numViews = 0
            }
            self.postsData.push(fullPostVal)
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
