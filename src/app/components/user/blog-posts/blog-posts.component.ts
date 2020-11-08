import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

@Component({
  selector: 'app-blog-posts',
  templateUrl: './blog-posts.component.html',
  styleUrls: ['./blog-posts.component.scss']
})
export class BlogPostsComponent implements OnInit {
  posts
  postsData;
  constructor() { }

  ngOnInit() {
    this.getPosts()
  }

  getPosts() {
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      firebase.database().ref('users/' + user.uid + '/blog-posts').on('value', async function (postData) {
        self.posts = postData.val()
        let postRefs = []
        postRefs = Object.values(self.posts)
        self.postsData = []
        for (let post of postRefs) {
          let fullPost = await firebase.database().ref(post).once('value')
          post = post.replace('blog/', '')
          console.log(post)
          self.postsData[post] = fullPost.val()
        }
      })
    })
  }
}
