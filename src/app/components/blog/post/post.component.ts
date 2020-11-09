import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
export class PostComponent implements OnInit, AfterViewInit {

  constructor(private route: ActivatedRoute, private sortService: SortService, private dateService: DateService, private router: Router) { }
  id;
  time;
  title;
  post;
  editLink;
  parsedTime
  comment;
  iframe;
  @ViewChild('iframeContent', { static: true }) iframeBox: ElementRef;
  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.id = params.get('id');
      this.time = +params.get('time')
      this.title = params.get('title')
      this.editLink = `/blog/post/${this.id}/edit`
      this.getPost()
      if (this.post) {
        this.parsedTime = this.dateService.parser(this.post.time)
      }
    });
  }

  ngAfterViewInit() {
    console.log(this.iframeBox.nativeElement.innerHTML);
    this.getPost()
  }

  getPost() {
    let self = this
    firebase.database().ref(`/blog/${this.id}`).on('value', (postData) => {
      self.post = postData.val()
      if (self.post) {
        self.post.comments = Object.values(self.post.comments).reverse()
        self.iframe = self.post.content.match(/&lt;iframe(?:.*?)&lt;\/iframe&gt;/g)
        if (self.iframe) {
          const parsedIframe = self.iframe[0].replace('&lt;', "<").replace('&lt;', "<").replace('&gt;', '>').replace('&gt;', '>')
          self.post.content = self.post.content.replace(self.iframe, parsedIframe)
          console.log(self.post.content)
          // self.iframeBox.nativeElement.innerHTML = self.iframe
        }
      }
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
