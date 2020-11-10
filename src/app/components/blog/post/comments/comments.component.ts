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
  gearData = { id: '', editLink: '', dbLink: '', type: 'comment', editors: [] }

  constructor(private dateService: DateService) { }

  ngOnInit() {
    this.href = '#id' + this.comment.id
    this.gearData.editors.push(this.comment.uid)
    this.gearData.editors.push(this.comment.parentUid)
    this.gearData.dbLink = 'blog/' + this.comment.parentId + '/comments/' + this.comment.id
    this.gearData.id = this.comment.id

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
          parentUid: self.comment.parentUid,
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
