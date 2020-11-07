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
  constructor(private dateService: DateService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    let self = this
    firebase.database().ref('/blog/').on('value', function (blogData) {
      self.posts = blogData.val()
      let a = []
      a = Object.values(self.posts)
      for (let post of a) {
        let total = 0
        post.cover = post.cover.replace('src=', "width='100%' src=")
        console.log(post.cover)
        try {
          post.cover.replaceAll('\\', '')
        } catch (e) { }
        let b = []
        if (post.comments) {
          b = Object.values(post.comments)
          for (let comment of b) {
            total += comment.replies.length + 1
          }
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
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        let postRef = firebase.database().ref('/users/' + user.uid + '/drafts').push()
        let postId = postRef.key
        postRef.set({
          authorImg: user.photoURL,
          authorName: user.displayName,
          comments: [],
          content: "<p>Set the title in the text input above. The first image attached in this post will be set as the cover. Main content of your blog post goes here </p>",
          cover: "<img src='../../../assets/STNEWCOVER2.png'>",
          parsedReadTime: "",
          title: 'New Blog Post Title',
          parsedTime: parsed,
          readTime: "",
          time: time,
          uid: user.uid
        })
        window.location.href = `/blog/drafts/${postId}/${time}/edit`;
      }
    })
  }
}
