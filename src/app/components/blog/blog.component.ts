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
  userLiked
  constructor(private dateService: DateService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    let self = this
    firebase.database().ref('/blog/').on('value', function (blogData) {
      self.posts = blogData.val()
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
          uid: user.uid
        })
        window.location.href = `/blog/drafts/${postId}/edit`;
      }
    })
  }

}
