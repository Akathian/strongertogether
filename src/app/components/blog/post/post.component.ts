import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import { ActivatedRoute, Router } from '@angular/router';
import { SortService } from '../../../services/sort.service'
import { DateService } from '../../../services/date.service'
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  constructor(private route: ActivatedRoute, private sortService: SortService, private dateService: DateService, private router: Router) { }
  id;
  time;
  title;
  post;
  editLink;
  parsedTime
  comment
  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.id = params.get('id');
      this.time = +params.get('time')
      this.title = params.get('title')
      this.editLink = `/blog/post/${this.id}/edit`
      this.getPost()
      this.parsedTime = this.dateService.parser(this.post.time)

    });
  }
  getPost() {
    let self = this
    firebase.database().ref(`/blog/${this.id}`).on('value', (postData) => {
      self.post = postData.val()
      self.post.comments = Object.values(self.post.comments).reverse()
      console.log(Object.values(self.post.comments))
    })
  }

  sort(event) {
    let i = event.target.options.selectedIndex
    let option = event.target.options[i].value
    this.sortService.sort(option, this.post.comments)
  }

  commentChange(comment) {
    this.comment = comment
  }

  postComment() {
    if (this.comment) {
      let self = this
      let d = new Date()
      firebase.auth().onAuthStateChanged(function (user) {

        let newCommentRef = firebase.database().ref('blog/' + self.id + '/comments').push()
        let commentId = newCommentRef.key
        let commentData = {
          authorImg: user.photoURL,
          authorName: user.displayName,
          content: self.comment,
          time: d.getTime(),
          uid: user.uid,
          replies: '',
          id: commentId,
          parentId: self.id
        }
        newCommentRef.set(commentData);
        (<HTMLTextAreaElement>document.getElementById('commentFormArea')).value = '';
        let updates = {}
        updates['users/' + user.uid + '/blog-comments/public/' + commentId] = 'blog/' + self.id + '/comments/' + commentId
        firebase.database().ref().update(updates)
      })
    }
  }
}
