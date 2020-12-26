import { AfterViewInit, Component, OnInit } from '@angular/core';

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
  isAdmin = false
  currPath;
  pinnedPosts = [];
  constructor() { }

  ngOnInit() {
    this.currPath = window.location.pathname
    this.path = window.location.pathname.replace('/blog', '').replace('-', '') || 'general'
    this.getNumPosts();
    this.getPins();
    this.getPosts()
    this.checkAdmin()


  }
  getPins() {
    let self = this
    firebase.database().ref('blog/pinned').on('value', async function (pinData) {
      if (pinData.val()) {
        self.pinnedPosts = []
        let pinnedRefs = []
        pinnedRefs = Object.values(pinData.val()).reverse()
        for (let ref of pinnedRefs) {
          let pinnedPost = await (await firebase.database().ref(ref).once('value')).val()
          if (pinnedPost) {
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
    firebase.database().ref('blog/pinned/' + postId).set('blog/general/' + postId)
    firebase.database().ref('blog/general/' + postId + '/pinned').set('true')

  }

  unpin(postId) {
    firebase.database().ref('blog/pinned/' + postId).remove()
    firebase.database().ref('blog/general/' + postId + '/pinned').set(null)

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

    if (this.nextKey) {
      postQuery = firebase.database().ref('/blog/' + this.path).orderByKey().endAt(this.nextKey).limitToLast(OFFSET + 1)
    } else {
      postQuery = firebase.database().ref('/blog/' + this.path).orderByKey().limitToLast(OFFSET + 1)
    }
    postQuery.once('value', async function (blogData) {
      if (blogData.val()) {
        let toValues = Object.values(blogData.val())
        if (self.path !== 'general') {
          let refs = []
          if (self.page !== self.numPages && self.numPages > 0) {
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
              post.gearData = {
                id: post.id,
                dbLink: ref,
                editLink: '/blog/post/' + post.id + '/edit',
                type: 'post',
                editors: [post.uid]
              }
              posts.push(post)
            }
          }
          self.posts = posts
        } else {
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
                dbLink: 'blog/general/' + post.id,
                editLink: '/blog/post/' + post.id + '/edit',
                type: 'post',
                editors: [post.uid]
              }
            }
          }
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
          content: `<p>
          Set the title in the text input above. The first image attached in this post
          will be set as the cover. Set the category of the post using the dropdown menu.
          Main content of your blog post goes here. Paste multiple pictures, but it's best to paste smaller resolution images to save space on the server. 
          <p>To link a spotify podcast:</p>
          <ol>
            <li>Open Spotify Desktop/Web</li>
            <li>Find the podcast you would like to share</li>
            <li>Once found, hover over the podcast and click the 3 dots &middot;&middot;&middot;</li>
            <li>Click Share > Copy Embed Code</li>
            <li>Paste it here</li>
            <li>The player should appear once you publish the post!</li>
          </ol>
        </p>`
          ,
          cover: "<img width='100%' src='../../../assets/STNEWCOVER2.png'>",
          title: 'New Blog Post Title',
          readTime: "0",
          time: time,
          uid: user.uid,
          id: postId,
          category: 'general'
        }, function (err) {
          if (!err) {
            window.location.href = `/blog/drafts/${postId}/edit`;
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
