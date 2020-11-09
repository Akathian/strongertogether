import { Component, OnInit, Input } from '@angular/core';
import { DateService } from '../../../../services/date.service'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input() comment
  reply
  href
  parsedTime;
  constructor(private dateService: DateService) { }

  ngOnInit() {
    this.href = '#id' + this.comment.time
    this.parsedTime = this.dateService.parser(this.comment.time)
  }

  replyChange(reply) {
    this.reply = reply
  }

  postReply() {
    if (this.reply) {
      let self = this
      let d = new Date()
      firebase.auth().onAuthStateChanged(function (user) {
        let newReplyRef = firebase.database().ref('blog/' + self.comment.parentId + '/comments/' + self.comment.id + '/replies').push()
        let replyId = newReplyRef.key
        let replyData = {
          authorImg: user.photoURL,
          authorName: user.displayName,
          content: self.reply,
          time: d.getTime(),
          uid: user.uid,
          id: replyId,
          parentId: `${self.comment.parentId}/comments/${self.comment.id}`
        }
        newReplyRef.set(replyData);
        (<HTMLTextAreaElement>document.getElementById('replyFormArea')).value = '';
        let updates = {}
        updates['users/' + user.uid + '/blog-comments/public/' + replyId] = 'blog/' + self.comment.parentId + '/comments/' + self.comment.id + '/replies/' + replyId
        firebase.database().ref().update(updates)
      })
    }
  }
}
