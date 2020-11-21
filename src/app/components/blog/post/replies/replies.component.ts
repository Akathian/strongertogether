import { Component, Input, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

@Component({
  selector: 'app-replies',
  templateUrl: './replies.component.html',
  styleUrls: ['./replies.component.scss']
})
export class RepliesComponent implements OnInit {
  @Input() reply;
  gearData = { id: '', editLink: '', dbLink: '', type: 'reply', editors: [] }
  isAdmin;
  constructor() { }

  ngOnInit() {
    this.gearData.editors.push(this.reply.uid)
    this.gearData.editors.push(this.reply.parentUid)
    this.gearData.dbLink = 'blog/general/' + this.reply.parentId + '/replies/' + this.reply.id
    this.gearData.id = this.reply.id
    let self = this
    firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        const admin = await (await firebase.database().ref('admins/' + user.uid).once('value')).val()
        self.isAdmin = admin ? true : false
      }
    })
  }
}
