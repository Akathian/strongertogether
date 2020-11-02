import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  posts;
  constructor() { }

  ngOnInit() {
    let self = this
    firebase.database().ref('/blog/').on('value', function(blogData) {
      self.posts = blogData.val().splice(1)
      for(let post of self.posts) {
        let total = 0
        for(let comment of post.comments) {
          total += comment.replies.length + 1
        }
        post.numComments = total
      }
    })
  }

}
