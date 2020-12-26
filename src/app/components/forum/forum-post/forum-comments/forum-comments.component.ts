import { Component, OnInit, Input } from '@angular/core';

import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

@Component({
  selector: 'app-forum-comments',
  templateUrl: './forum-comments.component.html',
  styleUrls: ['./forum-comments.component.scss']
})
export class ForumCommentsComponent implements OnInit {
  @Input() comment: any
  reply
  href
  gearData = { id: '', editLink: '', dbLink: '', type: 'comment', editors: [] }
  user
  isAdmin
  constructor() { }

  ngOnInit() {
    this.href = '#id' + this.comment.id
    this.gearData.editors.push(this.comment.uid)
    this.gearData.editors.push(this.comment.parentUid)
    this.gearData.dbLink = 'community/' + this.comment.parentId + '/comments/' + this.comment.id
    this.gearData.id = this.comment.id
    let self = this
    firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        self.user = user
        const admin = await (await firebase.database().ref('admins/' + user.uid).once('value')).val()
        self.isAdmin = admin ? true : false
      }
    })
  }

  replyChange(reply) {
    this.reply = reply
  }

  postReply(vis) {
    if (this.reply) {
      let self = this
      let d = new Date()
      firebase.auth().onAuthStateChanged(function (user) {
        let newReplyRef = firebase.database().ref('community/' + self.comment.parentId + '/comments/' + self.comment.id + '/replies').push()
        let replyId = newReplyRef.key
        let replyData = {
          authorImg: vis === 'anon' ? 'assets/anon.png' : user.photoURL,
          authorName: vis === 'anon' ? 'Anonymous' : user.displayName,
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
        let loc = vis === 'anon' ? 'private' : 'public'
        updates['users/' + user.uid + '/community-comments/' + loc + '/' + replyId] = 'community/' + self.comment.parentId + '/comments/' + self.comment.id + '/replies/' + replyId
        firebase.database().ref().update(updates)
      })
    }
  }
}

