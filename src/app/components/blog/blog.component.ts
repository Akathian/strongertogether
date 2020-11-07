import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import { DateService } from '../../services/date.service'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  posts;
  constructor(private dateService : DateService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    let self = this
    firebase.database().ref('/blog/').on('value', function(blogData) {
      self.posts = blogData.val()
      for(let post of self.posts) {
        let total = 0
        for(let comment of post.comments) {
          total += comment.replies.length + 1
        }
        post.numComments = total
      }
    })
  }

  newPost() {
    let d = (new Date()).getTime()
    let parsed = this.dateService.parser(d)
    let time = `${d}`
    let self = this
    firebase.auth().onAuthStateChanged(function(user) {
      if(user) {
          let postRef = firebase.database().ref('/users/' + user.uid + '/drafts').push()
          let postId = postRef.key
          postRef.set({
            authorImg: user.photoURL,
            authorName: user.displayName,
            comments : [],
            content : "<h2>New Blog Post</h2><p>Content Here</p>",
            cover : "",
            parsedReadTime : "",
            title: '',
            parsedTime: parsed,
            readTime : "",
            time : time,
            uid : user.uid
          })
          window.location.href = `/blog/drafts/${postId}/${time}/edit`;
        }
      })
  }
}
